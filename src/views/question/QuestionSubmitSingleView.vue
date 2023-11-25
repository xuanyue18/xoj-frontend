<template>
  <div id="questionSubmitSingleView">
    <a-row justify="space-between">
      <a-col flex="auto">
        <a-form :model="searchParams" layout="inline">
          <a-form-item label="状态: ">
            <a-select
              v-model="searchParams.status"
              :style="{ width: '150px' }"
              placeholder="题目状态"
              allow-clear
            >
              <a-option :value="0">待判题</a-option>
              <a-option :value="1">判题中</a-option>
              <a-option :value="2">成功</a-option>
              <a-option :value="3">失败</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="语言">
            <a-select
              v-model="searchParams.language"
              :style="{ width: '150px' }"
              placeholder="选择编程语言"
            >
              <a-option>java</a-option>
              <a-option>cpp</a-option>
              <a-option>go</a-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col flex="40px">
        <a-button
          type="outline"
          status="success"
          shape="round"
          :loading="loading"
          @click="doRefresh"
        >
          刷新
        </a-button>
      </a-col>
    </a-row>
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
      <template #status="{ record }">
        <!--        判题状态（0 - 待判题、1 - 判题中、2 - 成功、3 - 失败）-->
        <a-tag v-if="record.status === 0" color="cyan">待判题</a-tag>
        <a-tag v-if="record.status === 1" color="blue">判题中</a-tag>
        <a-tag v-if="record.status === 2" color="green">成功</a-tag>
        <a-tag v-if="record.status === 3" color="red">失败</a-tag>
      </template>
      <template #runtime="{ record }">
        <span v-if="record.judgeInfo.time">
          {{ record.judgeInfo.time }}ms
        </span>
        <span v-else> N/A </span>
      </template>
      <template #memory="{ record }">
        {{ record.judgeInfo.memory ?? "N/A" }}
      </template>
      <template #createTime="{ record }"
        >{{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="handleClick(record)">查看</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, watchEffect, defineEmits } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
  QuestionSubmitVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const props = defineProps(["questionId", "userId"]);

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      questionId: props.questionId,
    }
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

const tableRef = ref();
const dataList = ref([]);
const total = ref(0);

const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
  sortField: "createTime",
  sortOrder: "descend",
  userId: props.userId,
});

const loading = ref(false);

/**
 * 刷新
 */
const doRefresh = () => {
  loading.value = !loading.value;
  loadData();
  loading.value = !loading.value;
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

/**
 * 监听searchParams变量, 改变时触发页面的重新加载(首次加载时会触发导致发送两次请求)
 */
watchEffect(
  () => {
    loadData();
  }
  // { flush: "post" }
);

// {id: "1", title: "A+ D", content: "新的题目内容", tags: "["二叉树"]", answer: "新的答案", submitNum: 0,…}

const columns = [
  {
    title: "状态",
    slotName: "status",
    align: "center",
  },
  {
    title: "语言",
    dataIndex: "language",
    align: "center",
  },
  {
    title: "执行用时",
    slotName: "runtime",
    align: "center",
  },
  {
    title: "消耗内存",
    slotName: "memory",
    align: "center",
  },
  {
    title: "提交时间",
    slotName: "createTime",
    align: "center",
  },
  {
    title: "操作",
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

const showCard = ref(false);
const id = ref();

const emit = defineEmits<{
  change: [showcard: boolean, path: string]; // 具名元组语法
}>();
const handleClick = (question_submit: QuestionSubmitVO) => {
  showCard.value = !showCard.value;
  id.value = question_submit.id;
  emit("change", showCard.value, id.value);
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
#questionSubmitSingleView {
  margin: 0 auto;
}
</style>
