import axios from "axios";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
    _retry?: boolean;
    __retryCount?: number;
  }
}

type ErrorType =
  | "BAD_REQUEST"
  | "FORBIDDEN"
  | "TOO_MANY_REQUESTS"
  | "NOT_FOUND"
  | "REQUEST_TIMEOUT"
  | "SERVER_ERROR"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "CANCELLED" | "HTTP_ERROR";

export type NetworkError = {
  type: "NETWORK_ERROR";
  message: string;
  isRetryable: boolean;
};

export type HttpError = {
  type: ErrorType;
  status: number;
  message: string;
  isRetryable: boolean;
  validationErrors?: Record<string, string[]>;
};

export type StandardError = NetworkError | HttpError;
