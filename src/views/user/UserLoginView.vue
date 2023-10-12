<template>
  <div class="userLoginView">
    <h1>用户登录</h1>
    <a-form
      ref="formRef"
      style="max-width: 380px; margin: 0 auto"
      :label-col-props="{ span: 0 }"
      :wrapper-col-props="{ span: 24 }"
      size="large"
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item
        field="userAccount"
        :rules="[
          { required: true, message: '账号不能为空' },
          { minLength: 4, message: '账号长度不能低于4位' },
        ]"
        hide-asterisk="true"
      >
        <a-input
          v-model="form.userAccount"
          placeholder="请输入账号..."
          allow-clear
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="userPassword"
        :rules="[
          { required: true, message: '密码不能为空' },
          { minLength: 4, message: '密码不能小于8位' },
        ]"
        hide-asterisk="true"
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码..."
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item style="position: relative">
        <a-button type="primary" html-type="submit" style="width: 120px"
          >登录
        </a-button>
        <a-link
          @click="$router.push('/user/register')"
          :hoverable="false"
          style="position: absolute; bottom: 0; right: 0"
          >还没账号, 前往注册
        </a-link>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { UserControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
const formRef = ref();

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
});

/**
 * 提交表单
 * @param data
 */
const handleSubmit = async () => {
  const validate_res = await formRef.value?.validate();
  // console.log("验证结果:", validate_res);
  if (!validate_res) {
    const res = await UserControllerService.userLoginUsingPost(form);
    if (res.code == 0) {
      await store.dispatch("user/getLoginUser");
      localStorage.setItem("token", res.data.token);
      message.success("登录成功!");
      //登录成功, 跳转到主页
      await router.push({
        path: "/",
        replace: true,
      });
    } else {
      message.error("登录失败, " + res.message);
    }
  }
};
</script>
<style scoped>
h1 {
  font-family: "Montserrat", sans-serif;
  font-size: 40px;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-top: 30px;
}
</style>
