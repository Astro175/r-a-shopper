import { create } from "zustand";

type ToastType = "error" | "success" | "info";

type ToastState = {
  visible: boolean;
  message: string;
  type: ToastType;
  show: (message: string, type: ToastType) => void;
  timer: ReturnType<typeof setTimeout> | null;
  hide: () => void;
};

export const useToastStore = create<ToastState>((set, get) => ({
  visible: false,
  message: "",
  type: "error",
  show(message, type) {
    const { timer } = get();
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => {
      set({ visible: false, timer: null });
    }, 3000);
    set({ type, message, timer: newTimer, visible: true });
  },
  timer: null,
  hide() {
    const { timer } = get();
    if (timer) clearTimeout(timer);
    set({ visible: false, timer: null });
  },
}));
