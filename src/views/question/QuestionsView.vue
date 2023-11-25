<template>
  <div id="questionsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item label="难度" style="width: 240px">
        <a-select
          v-model="searchParams.difficulty"
          placeholder="选择难度"
          allow-clear
        >
          <a-option :value="0">简单</a-option>
          <a-option :value="1">中等</a-option>
          <a-option :value="2">困难</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="tags" label="标签" style="width: 240px">
        <a-input-tag v-model="searchParams.tags" placeholder="请选择标签" />
      </a-form-item>
      <a-form-item>
        <a-input-search
          v-model="searchParams.title"
          :style="{ width: '320px' }"
          @change="doSubmit"
          @click="doSubmit"
          placeholder="请输入题目名称"
          search-button
          allow-clear
        />
      </a-form-item>
    </a-form>
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
      @page-change="onPageChange"
    >
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green">
            {{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #difficulty="{ record }">
        <a-tag v-if="record.difficulty === 0" color="cyan">简单</a-tag>
        <a-tag v-if="record.difficulty === 1" color="orange">中等</a-tag>
        <a-tag v-if="record.difficulty === 2" color="red">困难</a-tag>
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
        >{{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="toQuestionPage(record)"
            >做题
          </a-button>
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
import moment from "moment";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  difficulty: undefined,
  pageSize: 12,
  current: 1,
  sortField: "createTime",
  sortOrder: "descend",
});

const loadData = async () => {
  searchParams.value.difficulty;
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
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
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "题号",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "题目",
    dataIndex: "title",
    align: "center",
  },

  {
    title: "标签",
    slotName: "tags",
    align: "center",
  },

  {
    title: "通过率",
    slotName: "acceptedRate",
    align: "center",
  },
  {
    title: "难度",
    slotName: "difficulty",
    align: "center",
  },
  {
    title: "创建时间",
    slotName: "createTime",
    align: "center",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    slotName: "optional",
    align: "center",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
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
#questionsView {
  max-width: 95%;
  margin: 0 auto;
}
</style>
