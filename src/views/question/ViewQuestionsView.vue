<template>
  <div id="viewQuestionsView">
    <a-split
      :style="{
        height: '100%',
        width: '100%',
        minWidth: '600px',
        padding: 0,
        margin: 0,
      }"
      min="0"
      max="0.7"
    >
      <!--伸缩杆-->
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
      <!--题目信息-->
      <template #first>
        <a-tabs
          default-active-key="question"
          :lazy-load="true"
          style="border: 1px solid #e5e6eb; border-radius: 4px; height: 83vh"
        >
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title" :bordered="false">
              <template #title>
                <h3 style="margin-bottom: 30px">{{ question.title }}</h3>
              </template>
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间">
                  <template #label
                    >时间
                    <icon-schedule />
                  </template>
                  {{ question.judgeConfig.timeLimit ?? 0 }}ms
                </a-descriptions-item>
                <a-descriptions-item label="内存">
                  <template #label
                    >内存
                    <icon-storage />
                  </template>
                  {{ question.judgeConfig.memoryLimit ?? 0 }}MB
                </a-descriptions-item>
                <a-descriptions-item label="堆栈">
                  <template #label
                    >堆栈
                    <icon-layers />
                  </template>
                  {{ question.judgeConfig.stackLimit ?? 0 }}MB
                </a-descriptions-item>
              </a-descriptions>
              <a-scrollbar style="height: 62vh; overflow: auto">
                <md-viewer :value="question.content || ''" />
              </a-scrollbar>
              <template #extra>
                <a-space wrap>
                  <a-tag v-if="question.difficulty == 0" color="cyan"
                    >简单
                  </a-tag>
                  <a-tag v-if="question.difficulty == 1" color="orange"
                    >中等
                  </a-tag>
                  <a-tag v-if="question.difficulty == 2" color="red"
                    >困难
                  </a-tag>
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
            <div class="answer">
              <md-viewer
                :value="question?.answer ?? '提交之后即可查看答案'"
                style="min-height: 600px; height: 75vh; padding: 0px 10px"
              />
            </div>
          </a-tab-pane>
          <a-tab-pane key="submit_record" title="提交记录">
            <a-scrollbar style="height: 70vh; overflow: auto">
              <question-submit-alone-view
                v-if="question"
                :question-id="question.id"
                :user-id="loginUser.id"
                @change="doChange"
                style="padding: 10px"
              />
            </a-scrollbar>
          </a-tab-pane>
        </a-tabs>
      </template>
      <!--编辑器/提交记录-->
      <template #second>
        <a-card
          v-if="showCard || question_submit_id"
          style="max-height: 83vh; height: 83vh; border-radius: 4px"
          :header-style="{ height: '39px' }"
          title="提交记录"
        >
          <template #extra>
            <a-button type="text" long shape="circle" @click="doClose">
              <icon-close />
            </a-button>
          </template>
          <template #actions>
            <div v-if="question_submit">
              <a-typography-text type="secondary" style="font-size: small">
                通过测试用例：
              </a-typography-text>
              <a-typography-text
                bold
                style="font-size: medium; margin-right: 20px"
              >
                {{ question_submit.judgeInfo.pass }} /
                {{ question_submit.judgeInfo.total }}
              </a-typography-text>
              <a-typography-text
                v-if="question_submit.judgeInfo?.status == 'accepted'"
                type="success"
                style="font-size: large"
              >
                <icon-check-circle />
                通过
              </a-typography-text>
              <a-typography-text v-else type="danger" style="font-size: large">
                <icon-close-circle />
                {{
                  question_submit.judgeInfo?.status === "wrong answer"
                    ? "答案错误"
                    : question_submit.judgeInfo?.status === "compile error"
                    ? "编译错误"
                    : question_submit.judgeInfo?.status ===
                      "time limit exceeded"
                    ? "超时"
                    : ""
                }}
              </a-typography-text>
            </div>
          </template>
          <a-card-meta>
            <template #avatar>
              <div
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#1D2129',
                }"
              >
                <a-avatar
                  :size="40"
                  :style="{ marginRight: '8px' }"
                  :image-url="question_submit?.userVO?.userAvatar"
                >
                </a-avatar>
                <a-space direction="vertical" fill :size="1">
                  <a-typography-text bold style="font-size: medium"
                    >{{ question_submit?.userVO?.userName }}
                  </a-typography-text>
                  <a-typography-text disabled
                    >{{
                      moment(question_submit?.createTime).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )
                    }}
                  </a-typography-text>
                </a-space>
              </div>
            </template>
          </a-card-meta>
          <a-space style="margin: 20px 0px">
            <a-tag color="green" bordered style="border-radius: 12px"
              >{{ question_submit?.language }}
            </a-tag>
            <a-tag color="green" bordered style="border-radius: 12px">
              <icon-clock-circle />
              {{ question_submit?.judgeInfo?.time }}ms
            </a-tag>
          </a-space>
          <a-scrollbar style="height: calc(80vh - 170px); overflow: auto">
            <div
              v-show="question_submit?.judgeInfo?.status != 'accepted'"
              style="
                background-color: #f7f7f7;
                padding: 20px;
                border-radius: 10px;
              "
            >
              <div>错误信息</div>
              <a-divider :margin="4" />
              <a-typography-text type="danger">
                {{ question_submit?.judgeInfo.message }}
              </a-typography-text>
              <div
                v-show="question_submit?.judgeInfo?.status == 'wrong answer'"
              >
                <div style="margin-top: 15px">最后执行输入</div>
                <a-divider :margin="4" />
                <div>
                  {{ question_submit?.judgeInfo.input }}
                </div>
                <div style="margin-top: 15px">预期输出</div>
                <a-divider :margin="4" />
                <div style="color: #3491fa">
                  {{ question_submit?.judgeInfo.expectedOutput }}
                </div>
                <div style="margin-top: 15px">实际输出</div>
                <a-divider :margin="4" />
                <div style="color: #f53f3f">
                  {{ question_submit?.judgeInfo.output }}
                </div>
              </div>
            </div>
            <md-viewer
              :value="'```java\n' + question_submit?.code + '```' || ''"
            />
          </a-scrollbar>
        </a-card>
        <a-card
          v-else
          style="height: 83vh; border-radius: 4px"
          :header-style="{ height: '39px' }"
          :body-style="{ padding: '0px' }"
        >
          <template #title>
            <a-form :model="form" layout="inline">
              <a-form-item
                field="title"
                label="编程语言"
                style="min-width: 100px; margin-bottom: 0px"
              >
                <a-select
                  v-model="form.language"
                  :style="{ width: '150px' }"
                  placeholder="选择编程语言"
                >
                  <a-option>java</a-option>
                  <a-option disabled>cpp</a-option>
                  <a-option disabled>go</a-option>
                  <a-option disabled>暂支持Java</a-option>
                </a-select>
              </a-form-item>
            </a-form>
          </template>
          <template #extra>
            <a-space size="medium">
              <div v-if="!showTimer" @click="startTimer">
                <a-tooltip position="bottom" content="开始计时">
                  <IconClockCircle :size="24" />
                </a-tooltip>
              </div>
              <div v-else @click="stopTimer">
                <div>
                  {{ formatTime(time) }}
                  <a-tooltip position="bottom" content="重置">
                    <IconLoop :size="16" />
                  </a-tooltip>
                </div>
              </div>
            </a-space>
          </template>
          <template #actions>
            <a-space style="margin-right: 10px">
              <a-button type="dashed" disabled @click="doSubmit">运行</a-button>
              <a-button type="primary" @click="doSubmit">提交</a-button>
            </a-space>
          </template>

          <code-editor
            style="height: calc(83vh - 105px)"
            :value="form.code as string"
            :language="form.language"
            :handle-change="changeCode"
          />
        </a-card>
      </template>
    </a-split>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineProps,
  onMounted,
  onUnmounted,
  ref,
  watch,
  withDefaults,
} from "vue";
import {
  LoginUserVO,
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitVO,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import QuestionSubmitAloneView from "@/views/question/QuestionSubmitSingleView.vue";
import moment from "moment";
import store from "@/store";

interface Props {
  id: string;
}

const loginUser: LoginUserVO = computed(
  () => store.state.user.loginUser
) as LoginUserVO;
const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();
const question_submit = ref<QuestionSubmitVO>();
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

// 获取详细提交记录
const showCard = ref(false);
const question_submit_id = ref();
/**
 * 获取单条提交记录
 * @param val1 是否展示卡片
 * @param val2 题目提交id
 */
const doChange = async (val1: boolean, val2: string) => {
  showCard.value = val1;
  question_submit_id.value = val2;
  const res = await QuestionControllerService.getQuestionSubmitByIdUsingGet(
    question_submit_id.value
  );
  if (res.code === 0) {
    question_submit.value = res.data as QuestionSubmitVO;
  } else {
    message.error("加载失败，" + res.message);
  }
};

const doClose = () => {
  showCard.value = false;
  question_submit_id.value = undefined;
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

// 计时器
const showTimer = ref(false);
const time = ref(0);
let intervalId: any = null;

const formatTime = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds}`;
};

const startTimer = () => {
  showTimer.value = true;
};
const stopTimer = () => {
  showTimer.value = false;
  time.value = 0;
};

watch(
  () => showTimer.value,
  (newVal: boolean) => {
    if (newVal) {
      intervalId = setInterval(() => {
        time.value++;
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
  }
);
onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style>
#viewQuestionsView {
  width: 100%;
  height: 100%;
}

#viewQuestionsView {
}

.resize-trigger:hover {
  background-color: #0078fd;
}

.submit_result .markdown-body pre > code {
  border-radius: 10px;
}
</style>
