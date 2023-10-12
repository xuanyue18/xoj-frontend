<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<style>
#app {
}
</style>
<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout";
import { useRoute } from "vue-router";
import { onMounted } from "vue";

const route = useRoute();
// 解决屏幕收缩报错
const debounce = (callback: (...args: any[]) => void, delay: number) => {
  let tid: any;
  return function (...args: any[]) {
    const ctx = self;
    tid && clearTimeout(tid);
    tid = setTimeout(() => {
      callback.apply(ctx, args);
    }, delay);
  };
};

const _ = (window as any).ResizeObserver;
(window as any).ResizeObserver = class ResizeObserver extends _ {
  constructor(callback: (...args: any[]) => void) {
    callback = debounce(callback, 20);
    super(callback);
  }
};

/**
 * 全局初始化函数，有全局单次调用的代码，都可以写到这里
 */

const doInit = () => {
  console.log("hello 欢迎来到我的项目");
};

onMounted(() => {
  doInit();
});
</script>
