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
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

const buyerSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.email("Email format is incorrect"),
});

const sellerSchema = buyerSchema
  .extend({
    password: z
      .string()
      .min(8, "Password must be 8 characters")
      .refine((val) => /[A-Z]/.test(val), {
        error: "Add an uppercase character",
      })
      .refine((val) => /[0-9]/.test(val), { error: "Add a number" })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        error: "Add a special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((val) => val.password === val.confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
  });

type BuyerFormValues = z.infer<typeof buyerSchema>;
type SellerFormValues = z.infer<typeof sellerSchema>;

const SignUpScreen = () => {
  const buyerForm = useForm<BuyerFormValues>({
    resolver: zodResolver(buyerSchema),
  });
  const sellerForm = useForm<SellerFormValues>({
    resolver: zodResolver(sellerSchema),
  });

  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [isLoading, setIsLoading] = useState(false);

  const onSellerSubmit = async (formValues: SellerFormValues) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: formValues.email,
      password: formValues.password,
      options: {
        data: {
          full_name: formValues.fullName,
          role,
        },
      },
    });
    if (error) {
      showToast(error.message);
      return;
    }
    setIsLoading(false);
    if (!data.session) {
      router.push({
        pathname: "/verify-otp",
        params: { email: formValues.email },
      });
    }
  };
  const onBuyerSubmit = async (data: BuyerFormValues) => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        shouldCreateUser: true,
        data: {
          full_name: data.fullName,
          role,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      showToast(error.message);
      return;
    }

    router.push({
      pathname: "/verify-otp",
      params: { email: data.email },
    });
  };

  return (
    <TouchableWithoutFeedback className="flex-1" onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 p-5 bg-background">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={20}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center justify-center my-4">
            <MediumLogoIcon />
            <Text className="my-2.5 font-lato-bold text-[18px] text-text">
              Create Account
            </Text>

            <Text className="text-sm font-lato text-text">
              Please fill the details below
            </Text>
          </View>
          <View className="flex-row items-center justify-center gap-8">
            <Pressable
              className="items-center"
              onPress={() => setRole("buyer")}
            >
              <View
                className={`h-[60px] w-[60px] rounded-lg border items-center justify-center
                 p-3 ${
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
              onPress={() => setRole("seller")}
            >
              <View
                className={`h-[60px] w-[60px] rounded-lg border items-center justify-center p-3 ${
                  role === "seller"
                    ? "border-primary"
                    : "border-borderSecondary"
                }`}
              >
                <Ionicons
                  name="cube-outline"
                  size={28}
                  color={
                    role === "seller" ? Colors.primary : Colors.borderSecondary
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
          {role === "buyer" ? (
            <>
              <Controller
                name="fullName"
                control={buyerForm.control}
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
                control={buyerForm.control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    errorMessage={
                      buyerForm.formState.errors.email &&
                      buyerForm.formState.errors.email.message
                    }
                    value={value}
                    onChangeText={onChange}
                    autoComplete="email"
                    keyboardType="email-address"
                    placeholder="Email"
                    autoCapitalize="none"
                  />
                )}
              />
            </>
          ) : (
            <View className="gap-2">
              <Controller
                control={sellerForm.control}
                name="fullName"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Full Name"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Full Name"
                    errorMessage={
                      sellerForm.formState.errors.fullName &&
                      sellerForm.formState.errors.fullName.message
                    }
                  />
                )}
              />
              <Controller
                control={sellerForm.control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Email"
                    value={value}
                    onChangeText={onChange}
                    placeholder="E-mail"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    errorMessage={
                      sellerForm.formState.errors.email &&
                      sellerForm.formState.errors.email.message
                    }
                  />
                )}
              />
              <Controller
                control={sellerForm.control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    isPassword={true}
                    label="Password"
                    onChangeText={onChange}
                    placeholder="********"
                    value={value}
                  />
                )}
              />
              <Controller
                control={sellerForm.control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <Input
                    isPassword={true}
                    label="Confirm Password"
                    placeholder="********"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          )}
        </KeyboardAwareScrollView>
        <View className="flex-1" />

        <Button
          label="Proceed"
          variant="primary"
          isLoading={isLoading}
          onPress={() => {
            if (role === "buyer") {
              buyerForm.handleSubmit(onBuyerSubmit)();
            } else {
              sellerForm.handleSubmit(onSellerSubmit)();
            }
          }}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;
