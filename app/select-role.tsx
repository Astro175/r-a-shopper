import Button from "@/components/Button";
import { Colors } from "@/constants/colors";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { showToast } from "@/utils/toast";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SelectRoleScreen = () => {
  const setSession = useAuthStore((state) => state.setSession);
  const [loadingAction, setLoadingAction] = useState<"buyer" | "seller" | null>(
    null,
  );

  const handleUpdateUser = async (role: "seller" | "buyer") => {
    setLoadingAction(role);
    const { error, data } = await supabase.auth.updateUser({
      data: { role },
    });
    setLoadingAction(null);
    if (error || !data.user) {
      if(error) showToast(error.message)
      return;
    }
    supabase.auth.refreshSession();
    setSession({
      email: data.user.email!,
      userId: data.user.id,
      role: data.user.user_metadata.role,
    });
  };
  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="gap-8 flex-1 justify-center">
        <Button
          variant="outline"
          label="Are you a buyer?"
          isDisabled={loadingAction ? true : false}
          isLoading={loadingAction === "buyer"}
          icon={
            <Ionicons name="cart-outline" size={20} color={Colors.primary} />
          }
          onPress={() => handleUpdateUser("buyer")}
        />
        <Button
          variant="outline"
          isDisabled={loadingAction ? true : false}
          isLoading={loadingAction === "seller"}
          icon={
            <Ionicons
              name="bag-handle-outline"
              size={20}
              color={Colors.primary}
            />
          }
          label="Are you a seller?"
          onPress={() => handleUpdateUser("seller")}
        />
      </View>
    </SafeAreaView>
  );
};

export default SelectRoleScreen;
