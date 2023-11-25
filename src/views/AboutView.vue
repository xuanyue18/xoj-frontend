<template>
  <div id="about">
    <md-viewer :value="ABOUT_CONTENT || ''" />
  </div>
</template>
<script setup lang="ts">
import MdViewer from "@/components/MdViewer.vue";
import { ABOUT_CONTENT } from "@/assets/about";
</script>

<style scoped>
#about {
  width: 95%;
  margin: 0 auto;
}
</style>
