import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OnboardingStoreShape = {
  hasOnboarded: boolean;
  setHasOnboarded: (state: boolean) => void;
};

export const useOnboardingStore = create<OnboardingStoreShape>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      setHasOnboarded: (state) => set({ hasOnboarded: state }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
