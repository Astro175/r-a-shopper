import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { Redirect, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const withTimeout = async (promise: Promise<void>, timeoutMs: number) => {
  let timerId;
  const timeoutPromise = new Promise((_, reject) => {
    timerId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs} milliseconds`));
    }, timeoutMs);
  });
  try {
    await Promise.race([timeoutPromise, promise]);
  } finally {
    clearTimeout(timerId);
  }
};

WebBrowser.maybeCompleteAuthSession();
const VerifyMagicLinkScreen = () => {
  const { code } = useLocalSearchParams<{ code: string }>();
  const setSession = useAuthStore.getState().setSession;
  const [error, setError] = useState<string>();

  useEffect(() => {
    const exchangeCode = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setError(error.message ? error.message : "Something went wrong");
        return;
      }
      if (!data) {
        console.log(error);
        setError("Something went wrong");
        return;
      }
      setSession({
        userId: data.session.user.id,
        email: data.session.user.email!,
        role: data.session.user.user_metadata.role,
      });
    };
    const runExchangeWithTimeout = async () => {
      try {
        await withTimeout(exchangeCode(), 5000);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.startsWith('Operation timed out')) {
            setError(`Operation timed out`);
            return;
          }
          setError(`Something went wrong.`);
        }
      }
    };
    runExchangeWithTimeout();
  }, []);

  if (error) {
    return <Redirect href="/(auth)/sign-up" />;
  }

  return (
    <View>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default VerifyMagicLinkScreen;
