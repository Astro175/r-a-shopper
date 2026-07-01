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
import { QueryClientProvider } from "@tanstack/react-query";
import { isLoaded, useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
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
          role: data?.claims.user_role, // TODO: set up custom access token hook in Supabase DB
        });
      } else {
        clearSession();
      }
    });
    setIsAuthReady(true);

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthReady && loaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded, isAuthReady]);
  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack>
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
    </GestureHandlerRootView>
  );
}
