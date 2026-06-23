import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerTitleAlign: "left",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.screenTitle },
        headerTitleStyle: {
          fontFamily: "Lato_700Bold",
          fontSize: 16,
          color: Colors.text,
        },
      }}
    >
      <Stack.Screen name="verify-otp" options={{ title: "Verification" }} />
      <Stack.Screen name="get-started" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
