<template>
  <div id="questionSubmitView">
    <a-row justify="space-between">
      <a-col flex="auto">
        <a-form :model="searchParams" layout="inline">
          <a-form-item label="状态:">
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
          <a-form-item label="语言:">
            <a-select
              v-model="searchParams.language"
              :style="{ width: '150px' }"
              placeholder="编程语言"
              allow-clear
            >
              <a-option>java</a-option>
              <a-option>cpp</a-option>
              <a-option>go</a-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-input-search
              v-model="searchParams.questionId"
              :style="{ width: '320px' }"
              @click="doSubmit"
              placeholder="请输入题号"
              search-button
              allow-clear
            />
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
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      table-layout-fixed="true"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #questionTitle="{ record }">
        <a-link
          v-if="record.questionTitle != ''"
          status="success"
          style="color: blue"
          @click="toQuestionPage(record)"
          >{{ record.questionTitle }}
        </a-link>
        <a-typography-text v-else disabled>题目不存在</a-typography-text>
      </template>
      <template #status="{ record }">
        <!--        判题状态（0 - 待判题、1 - 判题中、2 - 成功、3 - 失败）-->
        <a-tag v-if="record.status === 0" color="cyan">待判题</a-tag>
        <a-tag v-if="record.status === 1" color="blue">判题中</a-tag>
        <a-tag v-if="record.status === 2" color="green">成功</a-tag>
        <a-tag v-if="record.status === 3" color="red">失败</a-tag>
      </template>
      <template #judgeInfo="{ record }">
        {{ JSON.stringify(record.judgeInfo) }}
      </template>
      <template #createTime="{ record }"
        >{{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #optional="{ record }">
        <a-button type="primary" @click="handleClick(record)"
          >查看代码
        </a-button>
      </template>
    </a-table>
    <a-modal v-model:visible="visible" width="60%" hide-cancel>
      <template #title>{{ code.title }}</template>
      <md-viewer
        :value="'```' + code.language + '\n' + code.content + '```' || ''"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watchEffect } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitQueryRequest,
  QuestionSubmitVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import MdViewer from "@/components/MdViewer.vue";

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
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
const code = reactive({
  title: "",
  content: "",
  language: "",
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

const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 12,
  current: 1,
  sortField: "createTime",
  sortOrder: "descend",
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

/**
 * 监听searchParams变量, 改变时触发页面的重新加载(首次加载时会触发导致发送两次请求)
 */
watchEffect(() => {
  loadData();
});

const columns = [
  {
    title: "状态",
    slotName: "status",
    align: "center",
  },
  {
    title: "题目",
    slotName: "questionTitle",
    align: "center",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
    align: "center",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "编程语言",
    dataIndex: "language",
    align: "center",
  },
  {
    title: "提交者",
    dataIndex: "userVO.userName",
    align: "center",
  },
  {
    title: "提交时间",
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
 * @param questionSubmit
 */
const toQuestionPage = (questionSubmit: QuestionSubmitVO) => {
  router.push({
    path: `/view/question/${questionSubmit.questionId}`,
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

const visible = ref(false);
/**
 * 查看代码
 * @param record
 */
const handleClick = (record: {
  questionTitle: string;
  code: string;
  language: string;
}) => {
  code.title = record.questionTitle;
  code.content = record.code;
  code.language = record.language;
  visible.value = true;
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 95%;
  margin: 0 auto;
}

.demo {
  width: 600px;
}
</style>
