import { config } from "@/api/config/env";
import { AxiosInstance } from "axios";

export const attachLoggerInterceptor = (instance: AxiosInstance) => {
  if (config.environment === "development") {
    instance.interceptors.request.use((config) => {
      const timestamp = new Date().toISOString();
      console.log(
        `[${timestamp}] ${config.method?.toLocaleUpperCase()} ${config.url}`,
        `\nHeaders:`,
        config.headers,
      );
      return config;
    });
  }
};
