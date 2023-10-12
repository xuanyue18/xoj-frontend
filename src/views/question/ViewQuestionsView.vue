<template>
  <div id="viewQuestionsView">
    <a-split
      :style="{
        height: '80vh',
        width: '100%',
        minWidth: '500px',
        // border: '1px solid var(--color-border)',
        padding: 0,
        margin: 0,
      }"
      min="0"
      max="0.7"
    >
      <template #resize-trigger>
        <div
          class="resize-trigger"
          style="
            height: 100%;
            border-radius: 10px;
            display: grid;
            place-items: center;
          "
        >
          <icon-more-vertical style="width: 10px" />
        </div>
      </template>

      <template #first>
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间">
                  <template #label
                    >时间
                    <icon-schedule />
                  </template>
                  {{ question.judgeConfig.timeLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="内存">
                  <template #label
                    >内存
                    <icon-storage />
                  </template>
                  {{ question.judgeConfig.memoryLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈">
                  <template #label
                    >堆栈
                    <icon-layers />
                  </template>
                  {{ question.judgeConfig.stackLimit ?? 0 }}
                </a-descriptions-item>
              </a-descriptions>
              <md-viewer
                :value="question.content || ''"
                style="min-height: 500px; height: 57vh"
              />
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="评论" disabled>评论区</a-tab-pane>
          <a-tab-pane key="answer" title="答案">
            <a-card>
              <md-viewer
                :value="'提交之后即可查看答案'"
                style="min-height: 500px; height: calc(70vh - 7px)"
              />
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </template>
      <template #second>
        <a-form :model="form" layout="inline">
          <a-form-item
            field="title"
            label="编程语言"
            style="min-width: 100px; margin-bottom: 26px"
          >
            <a-select
              v-model="form.language"
              :style="{ width: '320px' }"
              placeholder="选择编程语言"
            >
              <a-option>java</a-option>
              <a-option disabled>cpp</a-option>
              <a-option disabled>go</a-option>
              <a-option disabled>暂支持Java</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <code-editor
          :value="form.code as string"
          :language="form.language"
          :handle-change="changeCode"
        />
        <a-card style="margin-top: 13px" size="small">
          <a-button type="primary" @click="doSubmit">提交代码</a-button>
        </a-card>
      </template>
    </a-split>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, withDefaults } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();
const total = ref(0);

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 不同语言的默认程序
 */
const codeDefaultValue = ref(
  "public class Main {\n" +
    "    public static void main(String[] args) {\n" +
    "        int a = Integer.parseInt(args[0]);\n" +
    "        int b = Integer.parseInt(args[1]);\n" +
    "        System.out.println(a + b);\n" +
    "    }\n" +
    "}\n"
);

const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: codeDefaultValue as unknown as string,
});

/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败, " + res.message);
  }
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const changeCode = (value: string) => {
  form.value.code = value;
};
</script>

<style>
#viewQuestionsView {
  width: 100%;
}

#viewQuestionsView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}

.resize-trigger:hover {
  background-color: #0078fd; /* 悬浮时的背景颜色 */
}
</style>
