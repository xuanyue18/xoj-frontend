<template>
  <div id="addQuestionView">
    <a-scrollbar style="height: 80vh; overflow: auto">
      <a-row>
        <h2 style="margin: 0 auto; padding: 10px">
          <template v-if="route.path.startsWith('/update')">
            修改题目信息
          </template>
          <template v-else>创建题目</template>
        </h2>
      </a-row>
      <a-form
        ref="formRef"
        :model="form"
        :label-col-props="{ span: 2 }"
        :wrapper-col-props="{ span: 22 }"
        auto-label-width
      >
        <a-form-item field="title" label="标题" required>
          <a-input
            v-model="form.title"
            placeholder="请输入标题"
            style="min-width: 100px; width: 90%"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="tags" label="标签" required>
          <a-input-tag
            v-model="form.tags"
            placeholder="请选择标签"
            style="min-width: 100px; width: 90%"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="content" label="内容" required>
          <MdEditor
            :value="form.content"
            :handle-change="onContentChange"
            style="width: 90%"
          />
        </a-form-item>
        <a-form-item field="answer" label="答案" required>
          <MdEditor
            :value="form.answer"
            :handle-change="onAnswerChange"
            style="width: 90%"
          />
        </a-form-item>
        <a-form-item label="限制">
          <a-space direction="vertical" style="min-width: 500px">
            <a-form-item
              field="judgeConfig.timeLimit"
              label="时间"
              tooltip="单位: ms"
            >
              <a-input-number
                v-model="form.judgeConfig.timeLimit"
                placeholder="请输入时间限制"
                mode="button"
                min="0"
                size="large"
              />
            </a-form-item>
            <a-form-item
              field="judgeConfig.memoryLimit"
              label="内存"
              tooltip="单位: MB"
            >
              <a-input-number
                v-model="form.judgeConfig.memoryLimit"
                placeholder="请输入内存限制"
                mode="button"
                min="0"
                size="large"
              />
            </a-form-item>
            <a-form-item
              field="judgeConfig.stackLimit"
              label="堆栈"
              tooltip="单位: MB"
            >
              <a-input-number
                v-model="form.judgeConfig.stackLimit"
                placeholder="请输入堆栈限制"
                mode="button"
                min="0"
                size="large"
              />
            </a-form-item>
          </a-space>
        </a-form-item>
        <a-form-item label="用例" :content-flex="false" :merge-props="false">
          <a-form-item
            v-for="(judgeCaseItem, index) of form.judgeCase"
            :key="index"
            no-style
          >
            <a-space :align="'baseline'">
              <a-space direction="vertical" style="min-width: 600px">
                <a-form-item
                  :field="`form.judgeCase[${index}].input`"
                  :label="`输入用例-${index}`"
                  :key="index"
                  tooltip="多个参数用空格隔开"
                >
                  <a-input
                    v-model="judgeCaseItem.input"
                    placeholder="请输入测试输入用例"
                  />
                </a-form-item>
                <a-form-item
                  :field="`form.judgeCase[${index}].output`"
                  :label="`输出用例-${index}`"
                  :key="index"
                  tooltip="多个输出用空格隔开"
                >
                  <a-input
                    v-model="judgeCaseItem.output"
                    placeholder="请输入测试输出用例"
                  />
                </a-form-item>
              </a-space>
              <a-space style="margin-right: 15px">
                <a-button status="danger" @click="handleDelete(index)">
                  删除
                </a-button>
              </a-space>
            </a-space>
          </a-form-item>
          <div style="margin-top: 10px">
            <a-button @click="handleAdd" type="outline" status="success"
              >新增测试用例
            </a-button>
          </div>
        </a-form-item>
        <a-form-item label="难度">
          <a-select
            v-model="form.difficulty"
            :style="{ width: '170px' }"
            placeholder="选择难度(默认简单)"
          >
            <a-option :value="0">简单</a-option>
            <a-option :value="1">中等</a-option>
            <a-option :value="2">困难</a-option>
          </a-select>
        </a-form-item>
        <div style="margin-top: 15px" />
        <a-form-item>
          <a-button type="primary" style="min-width: 200px" @click="doSubmit"
            >提交
          </a-button>
        </a-form-item>
      </a-form>
    </a-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes("update");
const formRef = ref();
const form = ref({
  title: "",
  tags: [],
  answer: "",
  content: "",
  judgeConfig: {
    memoryLimit: 150,
    stackLimit: 150,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
  difficulty: [],
});

/**
 * 根据题目 id 获取老的数据
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    // json 转 js 对象
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 150,
        stackLimit: 150,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const doSubmit = async () => {
  const validate_res = await formRef.value?.validate();
  if (!validate_res) {
    console.log(form.value);
    // 区分更新还是创建
    if (updatePage) {
      const res = await QuestionControllerService.updateQuestionUsingPost(
        form.value
      );
      if (res.code === 0) {
        message.success("更新成功");
      } else {
        message.error("更新失败，" + res.message);
      }
    } else {
      const res = await QuestionControllerService.addQuestionUsingPost(
        form.value
      );
      if (res.code === 0) {
        message.success("创建成功");
      } else {
        message.error("创建失败，" + res.message);
      }
    }
  }
};

/**
 * 新增判题用例
 */
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};

/**
 * 删除判题用例
 */
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};
</script>

<style scoped>
#addQuestionView {
}

:deep(.bytemd-fullscreen.bytemd) {
  z-index: 100;
}
</style>
