import { refreshClient } from "@/api/client/retryClient";
import { Mutex } from "async-mutex";
import { AxiosInstance } from "axios";
import * as secureStore from "expo-secure-store";

const mutex = new Mutex();

export const attachTokenRetryInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    function onFulfilled(response) {
      return response;
    },
    async function onError(error) {
      if (!error.response) return Promise.reject(error);
      else if (error.response.status !== 401) return Promise.reject(error);
      else {
        if (error.config._retry) {
          await secureStore.deleteItemAsync("accessToken");
          await secureStore.deleteItemAsync("refreshToken");
          return Promise.reject(error);
        }
        error.config._retry = true;
        const token = await mutex.runExclusive(async () => {
          try {
            const tokenInStore = await secureStore.getItemAsync("accessToken");
            const failedRequestToken =
              error.config.headers.Authorization.replace("Bearer ", "");
            if (failedRequestToken !== tokenInStore) return tokenInStore;
            const refreshToken = await secureStore.getItemAsync("refreshToken");
            const res = await refreshClient.post("/refresh", { refreshToken });
            await secureStore.setItemAsync(
              "refreshToken",
              res.data.refreshToken,
            );
            await secureStore.setItemAsync("accessToken", res.data.accessToken);
            return res.data.accessToken;
          } catch (err) {
            return Promise.reject(err);
          }
        });
        if (!token) return Promise.reject(error);
        error.config.headers.Authorization = `Bearer ${token}`;
        return instance(error.config);
      }
    },
  );
};
