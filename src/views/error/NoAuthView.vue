<template>
  <a-result status="403" title="403" subtitle="无权限访问">
    <template #extra>
      <a-space>
        <a-button type="primary" @click="$router.go(-1)">Back</a-button>
      </a-space>
    </template>
  </a-result>
</template>

<script lang="ts"></script>
