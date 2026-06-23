import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

export const maskEmail = (email: string): string => {
  const [username, domain] = email.split("@");

  if (!username || !domain) {
    return email;
  }

  const visibleChars = Math.min(2, username.length);
  const maskedPart = "*".repeat(Math.max(0, username.length - visibleChars));

  return `${username.slice(0, visibleChars)}${maskedPart}@${domain}`;
};

const VerifyOTPScreen = () => {
  const inputRefs = useRef<Array<TextInput | null>>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const { email } = useLocalSearchParams<{ email: string }>();
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown === 1) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = async () => {
    const isValid = otp.every(
      (item) => typeof item === "string" && item.trim().length > 0,
    );
    const token = otp.join("");
    if (isValid) {
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });
      if (error) {
        console.log(error.name, error.code);
      }
    }
  };
  const handleResend = async () => {
    setCountdown(60);
    setCanResend(false);
    const {} = supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.emailText}>
          We have sent verification code to your email
          <Text style={styles.emailHighlight}>{maskEmail(email)}</Text>
        </Text>
        <Text style={styles.instructionText}>
          Please enter your verification code
        </Text>
        <View>
          {otp.map((i, index) => (
            <TextInput
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              key={index}
              maxLength={1}
              style={[
                styles.otpInput,
                focusedIndex === index
                  ? styles.otpInputFocused
                  : styles.otpInputDefault,
              ]}
              keyboardType="numeric"
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace" && otp[index] === "") {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
              onChangeText={(text) => {
                const newOtp = [...otp];
                newOtp[index] = text;
                setOtp(newOtp);
                if (text.length === 1) {
                  setFocusedIndex(index);
                  inputRefs.current[index + 1]?.focus();
                }
              }}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              value={otp[index]}
            />
          ))}
        </View>
        <Pressable onPress={handleResend} disabled={!canResend}>
          <Text>{canResend ? "Resend code" : `Resend in ${countdown}s`}</Text>
        </Pressable>
        <View style={styles.spacer} />
        <Pressable style={styles.verifyButton} onPress={handleSubmit}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </Pressable>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  emailText: {
    textAlign: "center",
    fontFamily: "Lato_400Regular",
  },

  emailHighlight: {
    color: Colors.primary,
  },

  instructionText: {
    fontFamily: "Lato_400Regular",
    color: Colors.textSecondary,
  },

  otpInput: {
    width: 54,
    height: 54,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  otpInputFocused: {
    borderColor: Colors.primary,
  },

  otpInputDefault: {
    borderColor: Colors.secondary,
  },

  verifyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 20,
  },

  verifyButtonText: {
    textAlign: "center",
    color: Colors.text,
    fontFamily: "Lato_400Regular",
    fontSize: 12,
  },

  spacer: {
    flex: 1,
  },
});

export default VerifyOTPScreen;
