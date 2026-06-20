import { AxiosInstance } from "axios";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const attachRetryInterceptor = (instance: AxiosInstance) => {
  const baseDelay = 1000;
  const maxRetries = 3;
  instance.interceptors.response.use(
    function onFulfilled(response) {
      return response;
    },
    async function onRejected(error) {
      if (!error.config) {
        return Promise.reject(error);
      }
      const retryCount = error.config.__retryCount || 0;
      if (!error.response || error.response.status >= 500) {
        if (error.config.method === "post" || error.config.method === "patch") {
          return Promise.reject(error);
        }
        if (retryCount < maxRetries) {
          const delay = baseDelay * Math.pow(2, retryCount);
          await sleep(delay);
          error.config.__retryCount = retryCount + 1;
          return instance(error.config);
        } else {
          return Promise.reject(error);
        }
      } else {
        return Promise.reject(error);
      }
    },
  );
};
