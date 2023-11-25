// Add a request interceptor
import axios from "axios";
import { OpenAPI } from "../../generated";

// 携带凭证 cookie
OpenAPI.WITH_CREDENTIALS = true;
const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8121"
    : "http://47.113.151.164";

OpenAPI.BASE = baseUrl;
console.log("当前环境：", process.env.NODE_ENV, "请求地址", baseUrl);

axios.interceptors.request.use(
  function (config) {
    // 携带token发送请求
    const token = localStorage.getItem("token");
    // console.log("token: ", token);
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
