import type { SupportedStorage } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

const isNative =
  typeof navigator !== "undefined" && navigator.product === "ReactNative";

const getStorage = (): SupportedStorage => {
  if (!isNative) {
    // Server environment — return a no-op storage
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }

  // Native environment — use SecureStore
  const {
    getItemAsync,
    setItemAsync,
    deleteItemAsync,
  } = require("expo-secure-store");
  return {
    getItem: (key: string) => getItemAsync(key),
    setItem: (key: string, value: string) => {
      if (value.length > 2048) {
        console.warn(
          "Value being stored in SecureStore is larger than 2048 bytes...",
        );
      }
      return setItemAsync(key, value);
    },
    removeItem: (key: string) => deleteItemAsync(key),
  };
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  {
    auth: {
      storage: getStorage(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
