import GoogleIcon from "@/components/icons/GoogleIcon";
import MediumLogoIcon from "@/components/icons/MediumLogoIcon";
import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

const schema = z.object({
  email: z.email("Email is invalid"),
});

type FormData = z.infer<typeof schema>;

const LoginScreen = () => {
  const {
    control,
    formState: { errors },
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
      return;
    }
    router.push({ pathname: "/verify-otp", params: { email: formData.email } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <MediumLogoIcon />
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Please fill the details below</Text>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                autoComplete="email"
                keyboardType="email-address"
                placeholder="email"
                placeholderTextColor={Colors.placeholder}
                style={styles.input}
              />
            )}
          />
          {errors.email && <Text>{errors.email.message}</Text>}
        </View>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>

          <Pressable onPress={() => router.push("/sign-up")}>
            <Text style={styles.signUpLink}>Sign up</Text>
          </Pressable>
        </View>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <Pressable style={styles.googleButton}>
          <GoogleIcon />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>
        <View style={styles.spacer} />
        <Pressable
          onPress={handleSubmit(handleLogin)}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: Colors.text,
    fontFamily: "Lato_400Regular",
    fontSize: 20,
    marginTop: 24,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: "Lato_300Light",
    color: Colors.secondary,
    marginTop: 4,
  },

  inputContainer: {
    marginTop: 20,
  },

  input: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.secondary,
    color: Colors.text,
    fontFamily: "Lato_400Regular",
  },

  errorText: {
    color: Colors.error,
    fontFamily: "Lato_400Regular",
    fontSize: 12,
    marginTop: 4,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.secondary,
  },

  dividerText: {
    marginHorizontal: 12,
    color: Colors.secondary,
    fontFamily: "Lato_300Light",
    fontSize: 14,
  },

  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 10,
  },

  googleButtonText: {
    color: Colors.text,
    fontFamily: "Lato_400Regular",
    fontSize: 14,
  },

  spacer: {
    flex: 1,
  },

  loginButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  loginButtonText: {
    color: Colors.background,
    fontFamily: "Lato_400Regular",
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  signUpText: {
    color: Colors.secondary,
    fontFamily: "Lato_300Light",
    fontSize: 14,
  },

  signUpLink: {
    color: Colors.primary,
    fontFamily: "Lato_400Regular",
    fontSize: 14,
  },
});

export default LoginScreen;
