import { queryClient } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import {
  Lato_300Light,
  Lato_400Regular,
  Lato_700Bold,
  Lato_900Black,
} from "@expo-google-fonts/lato";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "@/components/Toast";
import "../global.css";
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const setSession = useAuthStore((state) => state.setSession);
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const hasOnboarded = useOnboardingStore((state) => state.hasOnboarded);
  const [loaded] = useFonts({
    Lato_400Regular,
    Lato_300Light,
    Lato_700Bold,
    Lato_900Black,
  });
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data } = await supabase.auth.getClaims();
        setSession({
          email: data?.claims.email!,
          userId: data?.claims.sub!,
          role: data?.claims.user_metadata?.role,
        });
      } else {
        clearSession();
      }

      setIsAuthReady(true);
    });

    GoogleSignin.configure({
      webClientId:
        "532065588307-8iigkhltgcispqg4n15oi0099ug238og.apps.googleusercontent.com",
      scopes: ["email", "profile"],
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthReady && loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isAuthReady]);

  if (!isAuthReady || !loaded) {
    return null;
  }
  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!!session}>
              <Stack.Screen name="(buyer)" />
              <Stack.Screen name="(seller)" />
            </Stack.Protected>
            <Stack.Protected guard={!session}>
              <Stack.Protected guard={!hasOnboarded}>
                <Stack.Screen name="onboarding" />
              </Stack.Protected>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>
          </Stack>
        </QueryClientProvider>
      </BottomSheetModalProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}
