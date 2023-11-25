<template>
  <a-result status="500" title="500" subtitle="服务器内部异常,请联系管理员!">
    <template #extra>
      <a-space>
        <a-button type="primary" @click="$router.go(-1)">Back</a-button>
      </a-space>
    </template>
  </a-result>
</template>

<script lang="ts"></script>
