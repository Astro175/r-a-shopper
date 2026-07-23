import { supabase } from "@/lib/supabase";
import { GoogleSignin, isErrorWithCode } from "@react-native-google-signin/google-signin";

export const handleGoogleSignIn = async () => {
  await GoogleSignin.hasPlayServices();
  const { data } = await GoogleSignin.signIn();
  if (!data) {
    throw new Error("Google Sign-in failed: no user data");
  }

  if (!data.idToken) {
    throw new Error("Google Sign failed: no ID Token returned")
  }
  const { error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: data.idToken,
  });
  if(error) {
    throw error
  }
};
