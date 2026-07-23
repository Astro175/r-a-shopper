import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="verify-otp" options={{ title: "Verification" }} />
      <Stack.Screen name="get-started" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
