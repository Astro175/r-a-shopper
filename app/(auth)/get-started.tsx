import Button from "@/components/Button";
import GoogleIcon from "@/components/icons/GoogleIcon";
import { Colors } from "@/constants/colors";
import { handleGoogleSignIn } from "@/utils/googleSignIn";
import { showToast } from "@/utils/toast";
import {
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GetStartedScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEmailPress = () => {
    router.push("/sign-up");
  };
  const handleGooglePress = async () => {
    try {
      setIsLoading(true);
      await handleGoogleSignIn();
    } catch (err) {
      if (isErrorWithCode(err)) {
        console.log(err);
        switch (err.code) {
          case statusCodes.IN_PROGRESS:
            showToast("Sign in already in progress")
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            showToast("Google Play Services unavailable")
            break;
          default:
            showToast("Google Sign-In failed. Please try again.")
        }
      } else {
        showToast(err instanceof Error ? err.message : "Something went wrong.")
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <View className="my-4">
        <Text className="text-center font-lato-bold text-xl text-textSecondary">
          Get started in a couple of minutes
        </Text>

        <Text className="font-lato text-text text-center mt-2">
          Follow the steps below to create your account in few minutes
        </Text>
      </View>
      <View className="mt-4 gap-6">
        <Button
          label="Continue with Google"
          variant="primary"
          isLoading={isLoading}
          onPress={handleGooglePress}
          icon={<GoogleIcon />}
        />
        <Button
          onPress={handleEmailPress}
          variant="secondary"
          label="Continue with E-mail"
          icon={<Ionicons name="mail" size={20} color={Colors.background} />}
        />
          
        
      </View>

      <View className="flex-1" />
      <Text className="font-lato text-lg text-textSecondary text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary">
          Login
        </Link>
      </Text>
    </SafeAreaView>
  );
};

export default GetStartedScreen;
