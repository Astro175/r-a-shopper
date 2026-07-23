import { useAuthStore } from "@/stores/authStore";
import { Redirect } from "expo-router";
import { useOnboardingStore } from "@/stores/onboardingStore";
const Index = () => {
 const hasOnboarded = useOnboardingStore((state) => state.hasOnboarded);
  const session = useAuthStore((state) => state.session);
  if(!hasOnboarded) return <Redirect href="/(auth)/onboarding"/>
  if (!session) return <Redirect href="/(auth)/get-started" />;
  if (session?.role === "seller") return <Redirect href="/" />;
  return <Redirect href="/(buyer)" />;
};

export default Index;
