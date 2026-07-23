import GoogleIcon from "@/components/icons/GoogleIcon";
import MediumLogoIcon from "@/components/icons/MediumLogoIcon";
import { supabase } from "@/lib/supabase";
import { handleGoogleSignIn } from "@/utils/googleSignIn";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { showToast } from "@/utils/toast";
import {
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

const schema = z.object({
  email: z.email("Email is invalid"),
});

type FormData = z.infer<typeof schema>;

const LoginScreen = () => {
  const {
    control,
    formState: { errors, isLoading: isPending },
    handleSubmit,
  } = useForm({ resolver: zodResolver(schema) });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (formData: FormData) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: formData.email,
      options: {
        shouldCreateUser: false,
      },
    });
    setIsLoading(false);
    if (error) {
      showToast(error.message);
      console.log(error);
      return;
    }
    router.push({ pathname: "/verify-otp", params: { email: formData.email } });
  };

  const handleGooglePress = async () => {
    try {
      setIsLoading(true);
      await handleGoogleSignIn();
    } catch (err) {
      if (isErrorWithCode(err)) {
        switch (err.code) {
          case statusCodes.IN_PROGRESS:
            showToast("Sign in already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            showToast("Google play services unavailable");
            break;
          default:
            showToast("Google Sign-In failed. Please try again.");
        }
      } else {
        showToast(err instanceof Error ? err.message : "Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-white">
      <View className="flex-1 justify-center ">
        <MediumLogoIcon />
        <Text className="text-2xl font-lato mt-6 text-text">Login</Text>
        <Text className="text-lg font-lato-light mt-2">
          Please fill the details below
        </Text>
        <View className="mt-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                errorMessage={errors.email && errors.email.message}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                placeholder="email"
              />
            )}
          />
        </View>
        <View className="flex-row justify-center mt-5">
          <Text className="text-sm font-lato-light text-textSecondary">
            Don't have an account?{" "}
          </Text>
          <Pressable onPress={() => router.push("/sign-up")}>
            <Text className="text-primary font-lato">Sign up</Text>
          </Pressable>
        </View>
        <View className="flex-row items-center my-6">
          <View className="flex-1 bg-secondary h-1" />
          <Text className="mx-3 text-secondary font-lato-light text-sm">
            OR
          </Text>
          <View className="flex-1 bg-secondary h-1" />
        </View>
        <Button
          label="Continue with Google"
          icon={<GoogleIcon />}
          isLoading={isLoading}
          onPress={handleGooglePress}
          variant="primary"
        />
        <View className="flex-1" />
        <Button
          label="Login"
          variant="primary"
          onPress={handleSubmit(handleLogin)}
          isDisabled={isPending}
        />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
