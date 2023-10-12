// Add a request interceptor
import axios from "axios";

axios.interceptors.request.use(
  function (config) {
    // 携带token发送请求
    const token = localStorage.getItem("token");
    console.log("token: ", token);
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
    console.log("响应", response);
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
