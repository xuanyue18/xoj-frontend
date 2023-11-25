<template>
  <div id="manageQuestionView">
    <a-row justify="space-between">
      <a-col flex="auto">
        <a-form :model="searchParams" layout="inline">
          <a-form-item field="tags" label="标签:" style="min-width: 200px">
            <a-input-tag v-model="searchParams.tags" placeholder="请选择标签" />
          </a-form-item>
          <a-form-item label="难度:">
            <a-select
              v-model="searchParams.difficulty"
              :style="{ width: '120px' }"
              placeholder="选择难度"
              allow-clear
            >
              <a-option :value="0">简单</a-option>
              <a-option :value="1">中等</a-option>
              <a-option :value="2">困难</a-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-input-search
              v-model="searchParams.keyword"
              :style="{ width: '320px' }"
              @change="doSubmit"
              @click="doSubmit"
              placeholder="请输入搜索关键词"
              search-button
            />
          </a-form-item>
        </a-form>
      </a-col>
      <a-col flex="80px">
        <a-button type="outline" @click="$router.push('/add/question')">
          <template #icon>
            <icon-plus />
          </template>
          新增题目
        </a-button>
      </a-col>
    </a-row>
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      :scroll="{ x: '100%', y: '100%' }"
      :scrollbar="true"
      column-resizable
      @page-change="onPageChange"
    >
      <template #difficulty="{ record }">
        <a-tag v-if="record.difficulty === 0" color="cyan">简单</a-tag>
        <a-tag v-if="record.difficulty === 1" color="orange">中等</a-tag>
        <a-tag v-if="record.difficulty === 2" color="red">困难</a-tag>
      </template>
      <template #judgeConfig="{ record }">
        <a-space>
          <a-tag :size="'small'" style="min-width: 80px">
            <template #icon>
              <icon-schedule />
            </template>
            {{ JSON.parse(record.judgeConfig).timeLimit }}ms
          </a-tag>
          <a-tag :size="'small'" style="min-width: 80px">
            <template #icon>
              <icon-storage />
            </template>
            {{ JSON.parse(record.judgeConfig).memoryLimit }}MB
          </a-tag>
          <a-tag :size="'small'" style="min-width: 80px">
            <template #icon>
              <icon-layers />
            </template>
            {{ JSON.parse(record.judgeConfig).stackLimit }}MB
          </a-tag>
        </a-space>
      </template>
      <template #judgeCase="{ record }">
        <a-space wrap>
          <a-tag
            v-for="(config, index) of JSON.parse(record.judgeCase)"
            :key="index"
            color="blue"
          >
            in: {{ config.input }} out:
            {{ config.output }}
          </a-tag>
        </a-space>
      </template>
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag
            v-for="(tag, index) of JSON.parse(record.tags)"
            :key="index"
            color="green"
          >
            {{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        {{
          `${
            record.submitNum
              ? ((record.acceptedNum / record.submitNum) * 100).toFixed(2)
              : "0.00"
          }% (${record.acceptedNum}/${record.submitNum})`
        }}
      </template>
      <template #createTime="{ record }"
        >{{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doUpdate(record)"> 修改</a-button>
          <a-button status="danger" @click="doDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment/moment";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  title: undefined,
  keyword: undefined,
  difficulty: undefined,
  tags: [],
  pageSize: 8,
  current: 1,
  sortField: "createTime",
  sortOrder: "descend",
});

const judgeConfig = ref();

const loadData = async () => {
  searchParams.value.difficulty;
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听searchParams变量, 改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
  console.log("监听到值发生了变化");
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "题目",
    dataIndex: "title",
    width: 150,
    align: "center",
  },
  {
    title: "难度",
    slotName: "difficulty",
    width: 80,
    align: "center",
  },
  {
    title: "标签",
    slotName: "tags",
    width: 200,
    align: "center",
  },
  {
    title: "判题配置",
    slotName: "judgeConfig",
    width: 300,
    align: "center",
  },
  {
    title: "判题用例",
    slotName: "judgeCase",
    width: 240,
    align: "center",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
    width: 140,
    align: "center",
  },
  {
    title: "创建时间",
    slotName: "createTime",
    width: 180,
    align: "center",
  },
  {
    title: "操作",
    slotName: "optional",
    width: 200,
    align: "center",
    fixed: "right",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const doDelete = async (question: Question) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (res.code === 0) {
    message.success("删除成功");
    loadData();
  } else {
    message.error("删除失败");
  }
};

const router = useRouter();

const doUpdate = (question: Question) => {
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
  });
};

/**
 * 确认搜素, 更新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped>
#manageQuestionView {
  max-width: 95%;
  margin: 0 auto;
}
</style>
