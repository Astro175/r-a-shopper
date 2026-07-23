import { StandardError } from "@/api/types";
import { useToastStore } from "@/stores/toastStore";

export const showToast = (
  message: string,
  type: "error" | "success" | "info" = "error",
) => {
 useToastStore.getState().show(message, type)
};
export const showErrorToast = (error: StandardError) => {
  showToast(error.message, "error");
};
