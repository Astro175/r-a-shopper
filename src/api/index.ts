import { instance } from "./client/apiClient";
import { attachAuthTokenInterceptor } from "./interceptors/auth";
import { attachErrorStandardizer } from "./interceptors/errorStandardizer";
import { attachLoggerInterceptor } from "./interceptors/logger";
import { attachRetryInterceptor } from "./interceptors/retry";
import { attachTokenRetryInterceptor } from "./interceptors/tokenRetry";

attachAuthTokenInterceptor(instance);
attachLoggerInterceptor(instance);
attachTokenRetryInterceptor(instance);
attachRetryInterceptor(instance);
attachErrorStandardizer(instance);

export default instance;
