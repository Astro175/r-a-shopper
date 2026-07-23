import { Colors } from "@/constants/colors";
import { useToastStore } from "@/stores/toastStore";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const HIDDEN_Y = 200;
const VISIBLE_Y = 0;

const Toast = () => {
  const sv = useSharedValue(HIDDEN_Y);
  const visible = useToastStore((state) => state.visible);
  const type = useToastStore((state) => state.type);
  const message = useToastStore((state) => state.message);

  useEffect(() => {
    if (visible) {
      sv.value = withTiming(VISIBLE_Y, {
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
      });
    } else {
      sv.value = withTiming(HIDDEN_Y, {
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
      });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sv.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, styles.container]}>
      {type === "error" ? (
        <Ionicons name="close-circle" color={Colors.error} />
      ) : type === "info" ? (
        <Ionicons name="alert-circle" color={Colors.primary} />
      ) : (
        <Ionicons name="checkmark-circle" color="green" />
      )}
      <View>
        <Text
          className="font-lato-bold text-2xl"
          style={{
            color:
              type === "error"
                ? Colors.error
                : type === "info"
                  ? Colors.primary
                  : Colors.yellowPrimary,
          }}
        >
          {type === "error" ? "Error" : type === "info" ? "Info" : "Success"}
        </Text>
        <Text className="font-lato">{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 32,
    left: 16,
    right: 16,
    zIndex: 50,
    padding: 16,
    borderRadius: 10,
    backgroundColor: Colors.background,
    flexDirection: "row",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Toast;
