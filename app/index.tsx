import { useAuthStore } from "@/stores/authStore";
import { Redirect } from "expo-router";

const Index = () => {
  const session = useAuthStore((state) => state.session);
  if (!session) return <Redirect href="/(auth)/get-started" />;
  if (session?.role === "seller") return <Redirect href="/(seller)" />;
  return <Redirect href="/(buyer)" />;
};

export default Index;
