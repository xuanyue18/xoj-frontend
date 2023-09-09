<template>
  <div id="exampleView">
    <md-editor :value="mdValue" :handle-change="mdOnChange" />
    <textarea :value="mdValue"></textarea>
    <code-editor :value="codeValue" :handle-change="codeOnChange" />
    <textarea :value="codeValue"></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue"; // @ is an alias to /src

const codeValue = ref();
const mdValue = ref();
const mdOnChange = (v: string) => {
  mdValue.value = v;
  console.log(v);
};
const codeOnChange = (v: string) => {
  codeValue.value = v;
  console.log(v);
};
</script>
