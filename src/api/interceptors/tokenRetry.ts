import { supabase } from "@/lib/supabase";
import { AxiosInstance } from "axios";

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
          await supabase.auth.signOut();
          return Promise.reject(error);
        }
        error.config._retry = true;
        const { data, error: refreshError } = await supabase.auth.getSession();
        if (refreshError || !data.session) {
          await supabase.auth.signOut();
          return Promise.reject(error);
        }
        error.config.headers.Authorization = `Bearer ${data.session.access_token}`;
        return instance(error.config);
      }
    },
  );
};
