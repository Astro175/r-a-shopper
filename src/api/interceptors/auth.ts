import { AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";

export const attachAuthTokenInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(async (config) => {
    if (config.skipAuth) return config;
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // TODO: handle missing token case once auth flow is implemented
    return config;
  });
};
