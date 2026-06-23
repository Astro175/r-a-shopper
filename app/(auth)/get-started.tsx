import GoogleIcon from "@/components/icons/GoogleIcon";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GetStartedScreen = () => {
  const handleEmailPress = () => {
    router.push("/sign-up");
  };
  const handleGooglePress = () => {
    // TODO: implement Google Sign in
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Get started in a couple of minutes</Text>

        <Text style={styles.subtitle}>
          Follow the steps below to create your account in few minutes
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, styles.primaryButton]}>
          <GoogleIcon />
          <Text style={styles.primaryButtonText}>Continue with Google</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondaryButton]}
          onPress={handleEmailPress}
        >
          <Ionicons name="mail" size={20} />
          <Text style={styles.secondaryButtonText}>Continue with E-mail</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1 }} />
      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Link href="/login" style={styles.loginLink}>
          Login
        </Link>
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },

  header: {
    marginVertical: 15,
  },

  title: {
    fontFamily: "Lato_700Bold",
    fontSize: 20,
    color: Colors.text,
  },

  subtitle: {
    fontFamily: "Lato_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  buttonContainer: {
    gap: 12,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 20,
  },

  primaryButton: {
    backgroundColor: Colors.primary,
  },

  secondaryButton: {
    backgroundColor: Colors.border,
    borderWidth: 1,
    borderColor: "black",
  },

  primaryButtonText: {
    marginLeft: 10,
    color: Colors.text,
    fontFamily: "Lato_400Regular",
    fontSize: 12,
  },

  secondaryButtonText: {
    marginLeft: 10,
    color: Colors.text,
    fontFamily: "Lato_400Regular",
    fontSize: 12,
  },
  loginText: {
    color: Colors.textSecondary,
    fontFamily: "Lato_400Regular",
    fontSize: 14,
    textAlign: "center",
  },

  loginLink: {
    color: Colors.primary,
  },
});

export default GetStartedScreen;
