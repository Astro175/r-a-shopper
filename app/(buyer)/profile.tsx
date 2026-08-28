import { Colors } from "@/constants/colors";
import { supabase } from "@/lib/supabase";
import { Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

const profile = () => {
  const [loading, setIsLoading] = useState()
  const onSignOut = async () => {
    await supabase.auth.signOut({ scope: "local" });
  };
  return (
    <SafeAreaView className="flex-1 p-4">
      <View className="items-center justify-center flex-1">
        <Button title="Log out" color={Colors.primary} onPress={onSignOut} />
      </View>
    </SafeAreaView>
  );
};

export default profile;
