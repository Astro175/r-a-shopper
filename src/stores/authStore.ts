import { create } from "zustand";

type Session = {
  userId: string;
  email: string;
  role: "buyer" | "seller" | "admin";
};

type authStoreShape = {
  session: Session | null;
  setSession: (session: Session) => void;
  clearSession: () => void;
};

export const useAuthStore = create<authStoreShape>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),
}));
