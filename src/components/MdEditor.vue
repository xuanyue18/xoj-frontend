<template>
  <Editor
    :value="value"
    :mode="mode"
    :plugins="plugins"
    :locale="zhHans"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import "juejin-markdown-themes/dist/juejin.min.css";
import "highlight.js/styles/atom-one-dark-reasonable.css";
import zhHans from "bytemd/lib/locales/zh_Hans.json";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Editor } from "@bytemd/vue-next";
import { defineProps, withDefaults } from "vue";

interface Props {
  value: string;
  mode?: string;
  handleChange: (v: string) => void;
}

const plugins = [
  gfm(),
  highlight(),
  // Add more plugins here
];
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  mode: () => "split",
  handleChange: (v: string) => {
    // console.log(v);
  },
});
</script>

<style>
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}
</style>
