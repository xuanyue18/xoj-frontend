<template>
  <div class="userRegisterView">
    <h1>新用户注册</h1>
    <a-form
      ref="formRef"
      style="max-width: 380px; margin: 0 auto; padding: 0"
      size="large"
      :model="form"
      :label-col-props="{ span: 0 }"
      :wrapper-col-props="{ span: 24 }"
      @submit="handleSubmit"
    >
      <a-form-item
        field="userAccount"
        help="账号不少于 4 位"
        :rules="[
          { required: true, message: '账号不能为空' },
          { minLength: 4, message: '账号长度不能低于4位' },
        ]"
        hide-asterisk="true"
      >
        <a-input
          v-model="form.userAccount"
          placeholder="请输入账号"
          allow-clear
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="userPassword"
        help="密码不能小于8位"
        :rules="[
          { required: true, message: '密码不能为空' },
          { minLength: 8, message: '密码不能小于8位' },
        ]"
        hide-asterisk="true"
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <!--suppress TypeScriptValidateTypes -->
      <a-form-item
        field="checkPassword"
        help="与密码保持一致"
        :rules="[
          { required: true, message: '确认密码不能为空' },
          { minLength: 8, message: '确认密码小于8位' },
          { match: form.userPassword, message: '与输入的密码不一致' },
        ]"
        hide-asterisk="true"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请确认密码"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item style="position: relative">
        <a-button type="primary" html-type="submit" style="width: 120px"
          >注册
        </a-button>
        <a-link
          @click="$router.push('/user/login')"
          :hoverable="false"
          style="position: absolute; bottom: 0; right: 0"
          >已有账号, 前往登录
        </a-link>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
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
  checkPassword: "",
} as UserRegisterRequest);

/**
 * 提交表单
 * @param data
 */
const handleSubmit = async () => {
  const validate_res = await formRef.value?.validate();
  // console.log("验证结果:", validate_res);
  if (!validate_res) {
    const res = await UserControllerService.userRegisterUsingPost(form);
    if (res.code == 0) {
      await store.dispatch("user/getLoginUser");
      message.success("注册成功!");
      //注册成功, 跳转到登录页
      await router.push({
        path: "/user/login",
        replace: true,
      });
    } else {
      message.error("注册失败, " + res.message);
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
