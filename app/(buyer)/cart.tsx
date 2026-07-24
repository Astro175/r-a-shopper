import Button from "@/components/Button";
import { Colors } from "@/constants/colors";
import { useCartStore } from "@/stores/cartStore";
import { formatNaira } from "@/utils/currency";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Image } from "expo-image";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CartScreen = () => {
  const items = useCartStore((state) => state.cart);

  const increaseItemQuantity = useCartStore(
    (state) => state.increaseItemQuantity,
  );

  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const reduceItemQuantity = useCartStore((state) => state.reduceItemQuantity);

  const totalPrice = useCartStore((state) =>
    state.cart.reduce((sum, item) => sum + item.quantity * item.price, 0),
  );

  if (items.length === 0) {
    return (
      <SafeAreaView className="flex-1">
        <Text>Cart is empty</Text>
      </SafeAreaView>
    );
  }

  const handleCheckout = () => {};

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-2.5">
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 6,
                boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.15)",
              }}
              key={item.id}
              className="flex-row items-center justify-around rounded-2xl bg-white p-2 gap-2 py-4"
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={{
                  width: 80,
                  height: 72,
                }}
              />

              <View className="gap-4">
                <Text className="font-lato-bold text-[14px] text-text">
                  {item.name}
                </Text>

                <View className="flex-row justify-around">
                  <Pressable
                    disabled={item.quantity <= 1}
                    onPress={() => reduceItemQuantity(item.id)}
                  >
                    <Ionicons
                      name="remove"
                      size={24}
                      color={
                        item.quantity > 1 ? Colors.primary : Colors.primary
                      }
                    />
                  </Pressable>

                  <View className="rounded-md p-2 bg-primary">
                    <Text className="font-lato-bold text-[12px] text-background">
                      {item.quantity}
                    </Text>
                  </View>

                  <Pressable
                    disabled={item.quantity >= item.stockCount}
                    onPress={() => increaseItemQuantity(item.id)}
                  >
                    <Ionicons
                      name="add"
                      size={24}
                      color={
                        item.quantity < item.stockCount
                          ? Colors.primary
                          : Colors.primary
                      }
                    />
                  </Pressable>
                </View>
              </View>

              <View className="gap-4">
                <Text className="font-lato-bold text-lg text-primary">
                  {formatNaira(item.price)}
                </Text>

                <View className="justify-end">
                  <Pressable onPress={() => removeFromCart(item.id)}>
                    <Ionicons
                      name="trash-outline"
                      color={Colors.cancel}
                      size={24}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={() => (
            <View className="mt-4">
              <View className="my-5 h-0.5 bg-text" />

              <View className="gap-2">
                <Text className="font-lato-bold text-text">Order Info</Text>

                <View className="flex-row justify-between">
                  <Text className="font-lato text-textSecondary">Total</Text>

                  <Text className="font-lato-bold text-[18px] text-primary">
                    {formatNaira(totalPrice)}
                  </Text>
                </View>
              </View>

              <View className="flex-1" />
            </View>
          )}
        />
        <Button onPress={handleCheckout} label="Checkout" />
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;
