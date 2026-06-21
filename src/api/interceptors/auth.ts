import { supabase } from "@/lib/supabase";
import { AxiosInstance } from "axios";

export const attachAuthTokenInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(async (config) => {
    if (config.skipAuth) return config;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};
