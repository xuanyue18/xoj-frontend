<template>
  <a-row class="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :default-selected-keys="['1']"
        @menu-item-click="doMenuClick"
        v-model:selected-keys="selectedKeys"
        style="padding: 0"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/xoj-logo.png" />
            <div class="title">Xcode OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col
      flex="45px"
      style="padding: 15px 40px 15px 20px; background-color: #ffffff"
    >
      <a-popover
        position="bottom"
        :showArrow="false"
        :content-style="{ padding: 0 }"
      >
        <template
          v-if="loginUser && loginUser.userRole !== ACCESS_ENUM.NOT_LOGIN"
        >
          <template v-if="loginUser.userAvatar">
            <a-avatar shape="circle" :image-url="loginUser.userAvatar">
            </a-avatar>
          </template>
          <template v-else-if="loginUser.userName">
            <a-avatar :style="{ backgroundColor: '#14a9f8' }"
              >{{ loginUser.userName?.charAt(0).toUpperCase() }}
            </a-avatar>
          </template>
          <template v-else>
            <icon-user :size="30" />
          </template>
        </template>
        <template v-else>
          <a-avatar shape="circle">未登录</a-avatar>
        </template>
        <template #content>
          <template v-if="loginUser.userRole !== ACCESS_ENUM.NOT_LOGIN">
            <a-doption @click="handleClick">
              <icon-idcard />
              个人信息
            </a-doption>
            <a-doption @click="logout">
              <icon-export />
              退出登录
            </a-doption>
          </template>
          <template v-else>
            <a-doption @click="$router.push('user/login')">
              <icon-import />
              立即登录
            </a-doption>
            <a-doption @click="$router.push('user/register')">
              <icon-user-add />
              用户注册
            </a-doption>
          </template>
        </template>
      </a-popover>
    </a-col>
  </a-row>
  <a-drawer
    :width="340"
    :visible="visibleUser"
    ok-text="保存"
    @ok="handleOk"
    @cancel="handleCancel"
    unmountOnClose
  >
    <template #title>用户信息</template>

    <div style="text-align: center; margin-bottom: 10px">
      <a-upload
        action="/"
        :fileList="file ? [file] : []"
        :show-file-list="false"
        @change="onChange"
        :custom-request="uploadAvatar"
      >
        <template #upload-button>
          <div class="arco-upload-list-picture custom-upload-avatar">
            <a-avatar trigger-type="mask" :size="75" auto-fix-font-size>
              <img
                alt="avatar"
                :src="
                  updateForm.userAvatar
                    ? updateForm.userAvatar
                    : 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp'
                "
              />
              <template #trigger-icon>
                <IconEdit />
              </template>
            </a-avatar>
          </div>
        </template>
      </a-upload>
    </div>

    <a-form
      :model="updateForm"
      label-align="left"
      auto-label-width
      style="max-width: 480px; margin: 0 auto"
    >
      <a-form-item field="userAccount" label="账户 :">
        <a-input v-model="loginUser.userAccount" readonly />
      </a-form-item>
      <a-form-item field="userName" label="昵称 :">
        <a-input v-model="updateForm.userName" placeholder="请输入用户名称" />
      </a-form-item>
      <a-form-item field="userProfile" label="简介 :">
        <a-textarea
          v-model="updateForm.userProfile"
          placeholder="介绍一下自己把~"
        />
      </a-form-item>
    </a-form>
    <a-button type="outline" long @click="handlePasswordClick"
      >修改密码
    </a-button>
  </a-drawer>

  <a-modal
    :visible="visiblePassword"
    title="修改密码"
    @ok="changePassword"
    @cancel="handlePasswordCancel"
  >
    <a-form ref="passwordFormRef" :model="passwordForm">
      <a-form-item
        field="oldUserPassword"
        label="原密码: "
        :rules="[
          { required: true, message: '请输入原密码' },
          { minLength: 8, message: '密码不小于8位' },
        ]"
      >
        <a-input-password v-model="passwordForm.oldUserPassword" />
      </a-form-item>
      <a-form-item
        field="userPassword"
        label="新密码: "
        :rules="[
          { required: true, message: '请输入新密码' },
          { minLength: 8, message: '密码不小于8位' },
        ]"
      >
        <a-input-password v-model="passwordForm.userPassword" />
      </a-form-item>
      <a-form-item
        field="checkPassword"
        label="确认密码: "
        :rules="[
          { required: true, message: '确认密码不能为空' },
          { validator: isEqual, message: '与输入的密码不一致' },
        ]"
      >
        <a-input-password v-model="passwordForm.checkPassword" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRouter } from "vue-router";
import { computed, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";
import { FileItem, Message } from "@arco-design/web-vue";
import {
  FileControllerService,
  LoginUserVO,
  UserControllerService,
  UserUpdateMyRequest,
} from "../../generated";

const router = useRouter();
const store = useStore();
const loginUser: LoginUserVO = computed(
  () => store.state.user.loginUser
) as LoginUserVO;
const updateForm = ref<UserUpdateMyRequest>({
  userName: "",
  userAvatar: "",
  userProfile: "",
});

const passwordForm = ref<UserUpdateMyRequest>({
  userPassword: "",
  oldUserPassword: "",
  checkPassword: "",
});

const passwordFormRef = ref();
const visibleUser = ref(false);
const visiblePassword = ref(false);
const file = ref();

watchEffect(() => {
  const loginUser = store.state.user.loginUser;
  if (loginUser) {
    updateForm.value = { ...loginUser };
  }
});

// 默认主页
const selectedKeys = ref(["/"]);

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

//路由跳转后, 更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

// setTimeout(() => {
//   store.dispatch("user/getLoginUser", {
//     userName: "wzewei",
//     userRole: ACCESS_ENUM.ADMIN,
//   });
// }, 3000);

// 用户注销
const logout = () => {
  UserControllerService.userLogoutUsingPost();
  location.reload();
};

// 用户信息操作
const handleClick = () => {
  visibleUser.value = true;
};
const handleCancel = () => {
  visibleUser.value = false;
};
const handleOk = async () => {
  const res = await UserControllerService.updateMyUserUsingPost({
    ...updateForm.value,
  });
  if (res.code === 0) {
    Message.success("个人信息更新成功！");
    visibleUser.value = false;
    location.reload();
  } else {
    Message.error("更新失败！", res.msg);
  }
};

// 修改密码
const changePassword = async () => {
  const validate_res = await passwordFormRef.value?.validate();
  console.log(validate_res);
  if (!validate_res) {
    const res = await UserControllerService.updateMyUserUsingPost({
      ...passwordForm.value,
    });
    if (res.code === 0) {
      await router.push("/user/login");
      Message.success("密码修改成功！");
    } else {
      Message.error("更新失败, " + res.message);
    }
  }
};
const handlePasswordClick = () => {
  visiblePassword.value = true;
};
const handlePasswordCancel = () => {
  passwordFormRef.value.resetFields();
  visiblePassword.value = false;
};
const isEqual = (value: string, cb: (arg0: string) => void) => {
  return new Promise<void>((resolve) => {
    if (value !== passwordForm.value.userPassword) {
      cb("密码不一致");
    }
    resolve();
  });
};

// 头像上传
const onChange = async (_: never, currentFile: FileItem) => {
  file.value = {
    ...currentFile,
  };
};
const uploadAvatar = async () => {
  const res = await FileControllerService.uploadOssFileUsingPost(
    file?.value.file
  );
  if (res.code === 0) {
    if (updateForm.value) {
      updateForm.value.userAvatar = res.data;
    }
    Message.success("上传成功,点击保存完成修改!");
  } else {
    Message.error("上传失败！" + res.data);
  }
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 14px;
  font-family: "Helvetica Neue", sans-serif;
  font-size: 15px;
  color: #333;
}

.logo {
  height: 42px;
}
</style>
