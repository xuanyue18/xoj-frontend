<template>
  <a-result status="404" title="404" subtitle="找不到指定页面">
    <template #extra>
      <a-space>
        <a-button type="primary" @click="$router.go(-1)">Back</a-button>
      </a-space>
    </template>
  </a-result>
</template>

<script lang="ts"></script>
