import { AxiosInstance } from "axios";
import { StandardError } from "../types";

export const attachErrorStandardizer = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    function onFulfilled(response) {
      return response;
    },
    function onError(error) {
      if (!error.response) {
        const apiError: StandardError = {
          type: "NETWORK_ERROR",
          message: error.message,
          isRetryable: true,
        };
        return Promise.reject(apiError);
      } else {
        if (error.response.status === 401) {
          const apiError: StandardError = {
            isRetryable: false,
            status: error.response.status,
            message: error.response.data?.message ?? error.message,
            type: "UNAUTHORIZED",
          };
          return Promise.reject(apiError);
        } else if (error.response.status === 422) {
          const apiError: StandardError = {
            type: "VALIDATION_ERROR",
            message: error.response.data?.message ?? error.message,
            isRetryable: false,
            status: error.response.status,
            validationErrors: error.response.data.errors,
          };
          return Promise.reject(apiError);
        } else if (error.response.status === 400) {
          const apiError: StandardError = {
            type: "BAD_REQUEST",
            isRetryable: false,
            status: error.response.status,
            message: error.response.data?.message ?? error.message,
          };
          return Promise.reject(apiError);
        } else if (error.response.status === 403) {
          const apiError: StandardError = {
            type: "FORBIDDEN",
            isRetryable: false,
            message: error.response.data?.message ?? error.message,
            status: error.response.status,
          };
          return Promise.reject(apiError);
        } else if (error.response.status === 429) {
          const apiError: StandardError = {
            type: "TOO_MANY_REQUESTS",
            message: error.response.data?.message ?? error.message,
            isRetryable: true,
            status: error.response.status,
          };
          return Promise.reject(apiError);
        } else if (error.response.status === 404) {
          const apiError: StandardError = {
            type: "NOT_FOUND",
            isRetryable: false,
            status: error.response.status,
            message: error.response.data?.message ?? error.message,
          };
          return Promise.reject(apiError);
        } else if (error.response.status >= 500) {
          const apiError: StandardError = {
            type: "SERVER_ERROR",
            isRetryable: true,
            status: error.response.status,
            message: error.response.data?.message ?? error.message,
          };
          return Promise.reject(apiError);
        } else {
          const apiError: StandardError = {
            type: "HTTP_ERROR",
            status: error.response.status,
            message: error.response.data?.message ?? error.message,
            isRetryable: false,
          };
          return Promise.reject(apiError);
        }
      }
    },
  );
};
