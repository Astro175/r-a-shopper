import Button from "@/components/Button";
import MediumLogoIcon from "@/components/icons/MediumLogoIcon";
import Input from "@/components/Input";
import { Colors } from "@/constants/colors";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Ionicons from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

const schema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.email("Email format is incorrect"),
  role: z.enum(["buyer", "seller"]),
});

type FormValues = z.infer<typeof schema>;

const SignUpScreen = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "buyer" },
  });

  const role = watch("role");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        shouldCreateUser: true,
        data: {
          full_name: data.fullName,
          role: data.role,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      showToast(error.message)
      return;
    }

    router.push({
      pathname: "/verify-otp",
      params: { email: data.email },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-background p-5">
        <View className="my-4 items-center justify-center">
          <MediumLogoIcon />

          <Text className="my-2.5 font-lato-bold text-[18px] text-text">
            Create Account
          </Text>

          <Text className="font-lato text-sm text-text">
            Please fill the details below
          </Text>
        </View>
        <Controller
          name="role"
          control={control}
          render={({ field: { onChange } }) => (
            <View className="flex-row items-center justify-center gap-8">
              <Pressable
                className="items-center"
                onPress={() => onChange("buyer")}
              >
                <View
                  className={`h-[60px] w-[60px] rounded-lg border p-3 ${
                    role === "buyer"
                      ? "border-primary"
                      : "border-borderSecondary"
                  }`}
                >
                  <Ionicons
                    size={28}
                    name="cart-outline"
                    color={
                      role === "buyer" ? Colors.primary : Colors.borderSecondary
                    }
                  />
                </View>

                <Text
                  className={`text-center font-lato text-sm ${
                    role === "buyer" ? "text-primary" : "text-textSecondary"
                  }`}
                >
                  Buyer
                </Text>
              </Pressable>
              <Pressable
                className="items-center"
                onPress={() => onChange("seller")}
              >
                <View
                  className={`h-[60px] w-[60px] rounded-lg border p-3 ${
                    role === "seller"
                      ? "border-primary"
                      : "border-borderSecondary"
                  }`}
                >
                  <Ionicons
                    name="cube-outline"
                    size={28}
                    color={
                      role === "seller"
                        ? Colors.primary
                        : Colors.borderSecondary
                    }
                  />
                </View>

                <Text
                  className={`text-center font-lato text-sm ${
                    role === "seller" ? "text-primary" : "text-textSecondary"
                  }`}
                >
                  Seller
                </Text>
              </Pressable>
            </View>
          )}
        />

        {errors.role && (
          <Text className="mt-1 font-lato text-sm text-error">
            {errors.role.message}
          </Text>
        )}
        <Controller
          name="fullName"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Full Name"
              placeholderTextColor={Colors.placeholder}
              className="my-4 rounded-xl bg-secondary px-3 py-3.5"
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              errorMessage={errors.email && errors.email.message}
              value={value}
              onChangeText={onChange}
              autoComplete="email"
              keyboardType="email-address"
              placeholder="Email"
              autoCapitalize="none"
            />
          )}
        />
        <View className="flex-1" />

        <Button
          label="Proceed"
          variant="primary"
          isLoading={isLoading}
          onPress={handleSubmit(onSubmit)}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
