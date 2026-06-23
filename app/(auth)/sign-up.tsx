import MediumLogoIcon from "@/components/icons/MediumLogoIcon";
import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import Ionicons from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
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
  } = useForm({
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
      // TODO: Build Error UI
      return;
    }
    router.push({pathname: '/verify-otp', params: {email: data.email}});
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardAvoidingView}
    >
      <SafeAreaView style={styles.safeArea}>
        <MediumLogoIcon />
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Please fill the details below</Text>
        </View>
        <Controller
          name="role"
          control={control}
          render={({ field: { onChange } }) => (
            <View style={styles.roleContainer}>
              <Pressable onPress={() => onChange("buyer")}>
                <View
                  style={[
                    styles.roleIconContainer,
                    {
                      borderColor:
                        role === "buyer" ? Colors.primary : Colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    size={28}
                    name="cart-outline"
                    color={role === "buyer" ? Colors.primary : Colors.border}
                  />
                </View>
                <Text
                  style={[
                    styles.roleLabel,
                    {
                      color:
                        role === "buyer"
                          ? Colors.primary
                          : Colors.textSecondary,
                    },
                  ]}
                >
                  Buyer
                </Text>
              </Pressable>
              <Pressable onPress={() => onChange("seller")}>
                <View
                  style={[
                    styles.roleIconContainer,
                    {
                      borderColor:
                        role === "seller" ? Colors.primary : Colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="cube-outline"
                    size={28}
                    color={role === "seller" ? Colors.primary : Colors.border}
                  />
                </View>
                <Text
                  style={[
                    styles.roleLabel,
                    {
                      color:
                        role === "seller"
                          ? Colors.primary
                          : Colors.textSecondary,
                    },
                  ]}
                >
                  Seller
                </Text>
              </Pressable>
            </View>
          )}
        />
        {errors.role && (
          <Text style={styles.errorText}>{errors.role.message}</Text>
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
              style={styles.input}
            />
          )}
        />
        {errors.fullName && (
          <Text style={styles.errorText}>{errors.fullName.message}</Text>
        )}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              autoComplete="email"
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor={Colors.placeholder}
              style={styles.input}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={handleSubmit(onSubmit)}
          style={styles.proceedButton}
          disabled={isLoading}
        >
          <Text style={styles.proceedButtonText}>
            {isLoading ? "Sending..." : "Proceed"}
          </Text>
        </Pressable>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },

  headerContainer: {
    margin: 15,
  },

  title: {
    fontFamily: "Lato_400Regular",
    fontSize: 20,
    color: Colors.text,
  },

  subtitle: {
    color: Colors.textSecondary,
    fontFamily: "Lato_300Light",
    fontSize: 14,
  },
  errorText: {
    color: Colors.error,
    fontFamily: "Lato_400Regular",
    fontSize: 12,
    marginTop: 4,
  },

  roleContainer: {
    alignItems: "center",
    gap: 10,
  },

  roleButton: {
    alignItems: "center",
  },

  roleIconContainer: {
    width: 60,
    height: 60,
    padding: 13,
    borderRadius: 8,
  },

  roleLabel: {
    textAlign: "center",
  },

  input: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderColor: Colors.secondary,
  },

  spacer: {
    flex: 1,
  },

  proceedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 20,
  },

  proceedButtonText: {
    textAlign: "center",
    color: Colors.text,
    fontFamily: "Lato_400Regular",
    fontSize: 12,
  },
});

export default SignUpScreen;
