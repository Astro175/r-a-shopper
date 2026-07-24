import { Colors } from "@/constants/colors";
import { useProduct } from "@/hooks/useProduct";
import { useCartStore } from "@/stores/cartStore";
import { formatNaira } from "@/utils/currency";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProductDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, error } = useProduct(id);
  const [itemQuantity, setItemQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  if (error) {
    return (
      <SafeAreaView className="flex-1">
        <Text>Something went wrong. Please try again.</Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const handleAddQuantity = () => {
    if (itemQuantity < product.quantity) {
      setItemQuantity((prev) => prev + 1);
    }
  };

  const handleReduceQuantity = () => {
    if (itemQuantity > 1) {
      setItemQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: itemQuantity,
      sellerName: product.seller.name,
      stockCount: product.quantity,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-backgroundTertiary">
      <View className="flex-1 items-center bg-backgroundTertiary justify-center">
        <Image
          source={{ uri: product.imageUrl }}
          style={{ width: 350, height: 300 }}
        />
      </View>

      <View className="flex-1 rounded-t-2xl bg-background p-2.5">
        <View className="mt-2.5">
          <View className="mt-2.5 flex-row items-center justify-between">
            <Text className="font-lato-bold text-[16px] text-text">
              {product.name}
            </Text>

            <View className="h-10 w-[115px] flex-row items-center justify-around rounded-full bg-backgroundTertiary">
              <Pressable
                onPress={handleReduceQuantity}
                disabled={itemQuantity <= 1}
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={28}
                  color="black"
                />
              </Pressable>

              <Text className="font-lato text-[16px] text-text">
                {itemQuantity}
              </Text>

              <Pressable
                onPress={handleAddQuantity}
                disabled={itemQuantity >= product.quantity}
              >
                <Ionicons name="add-circle-outline" size={28} color="black" />
              </Pressable>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="flex-row gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Ionicons
                  key={index}
                  name={index < product.rating ? "star" : "star-outline"}
                  color={Colors.yellowPrimary}
                  size={13}
                />
              ))}
            </View>

            <Text className="font-lato text-[12px] text-textSecondary">
              {product.quantity} pieces in store
            </Text>
          </View>
        </View>

        {/* Vendor */}
        <View className="mt-2.5">
          <Text className="font-lato-bold text-[16px] text-text">
            Vendor details
          </Text>

          <View className="mt-2.5 flex-row justify-between">
            <View className="gap-2.5">
              <Image
                source={{ uri: product.seller.logoUrl }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                }}
              />

              <View>
                <Text className="font-lato text-[16px] text-text">
                  {product.seller.name}
                </Text>

                <Text className="font-lato text-[12px] text-textSecondary">
                  {product.seller.location}
                </Text>
              </View>
            </View>

            <Pressable className="flex-row items-center gap-2.5">
              <Text className="font-lato text-[14px] text-primary">
                Chat Vendor
              </Text>

              <Ionicons name="chatbubbles" size={24} color={Colors.primary} />
            </Pressable>
          </View>
        </View>

        {/* Description */}
        <View className="mt-2.5">
          <Text className="font-lato-bold text-[16px] text-text">
            Description
          </Text>

          <Text className="font-lato text-[14px] text-text">
            {product.description}
          </Text>
        </View>

        <View className="flex-1" />

        <View className="w-full flex-row items-center justify-between rounded-xl bg-primary p-3 px-5">
          <Text className="font-lato-bold text-[16px] text-background">
            {formatNaira(product.price)}
          </Text>

          <Pressable className="items-center justify-center rounded-lg bg-background p-2.5">
            <Text
              onPress={handleAddToCart}
              className="font-lato-bold text-[16px] text-primary"
            >
              Add to Cart
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetails;
