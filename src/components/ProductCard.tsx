import { Product } from "@/api/types/product";
import { formatNaira } from "@/utils/currency";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

type ProductCardProps = {
  product: Product;
  variant: "horizontal" | "grid";
  onPress: () => void;
};

const ProductCard = ({ product, variant, onPress }: ProductCardProps) => {
  return (
    <Pressable onPress={onPress}>
      {variant === "horizontal" ? (
        <View className="rounded-t-xl bg-background">
          <View className="items-center justify-center bg-secondary2 p-2 rounded-t-2xl">
            <Image
              source={{ uri: product.imageUrl }}
              style={{ width: 140, height: 100 }}
            />
          </View>

          <View className="mt-4 p-3 gap-2">
            <Text className="font-lato-bold text-[12px] text-text">
              {product.name}
            </Text>

            <Text className="font-lato-bold text-[14px] text-text">
              {formatNaira(product.price)}
            </Text>

            <Text className="font-lato text-[8px] text-textSecondary">
              {product.quantity} pieces remaining
            </Text>
          </View>
        </View>
      ) : (
        <View
          className="flex-1 m-1"
          style={{
            backgroundColor: "#fff",
            borderRadius: 6,
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.15)",
          }}
        >
          <View className="items-center rounded-t-lg bg-secondary2 py-5">
            <Image
              source={{ uri: product.imageUrl }}
              style={{ width: 140, height: 160 }}
            />
          </View>

          <View className="mt-2.5 gap-2 px-2 rounded-b-lg">
            <Text className="font-lato text-[16px] text-text">
              {product.name}
            </Text>

            <Text
              className="font-lato text-[10px] text-black"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {product.description}
            </Text>

            <View className="flex-row items-center justify-between">
              <Text className="font-lato-bold text-[10px] text-text">
                Vendor: {product.seller.name}
              </Text>
            </View>

            <Text className="font-lato-bold text-lg text-text">
              {formatNaira(product.price)}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default ProductCard;
