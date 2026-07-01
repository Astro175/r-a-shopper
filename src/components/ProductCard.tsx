import { Product } from "@/api/types/product";
import { Colors } from "@/constants/colors";
import { formatNaira } from "@/utils/currency";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
type ProductCardProps = {
  product: Product;
  variant: "horizontal" | "grid";
  onPress: () => void;
};

const ProductCard = ({ product, variant, onPress }: ProductCardProps) => {
  return (
    <Pressable onPress={onPress}>
      {variant === "horizontal" ? (
        <View style={styles.horizontalCard}>
          <View style={styles.horizontalImageWrapper}>
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.horizontalImage}
            />
          </View>

          <View style={styles.horizontalContent}>
            <Text style={styles.horizontalName}>{product.name}</Text>
            <Text style={styles.horizontalPrice}>
              {formatNaira(product.price)}
            </Text>
            <Text style={styles.horizontalStock}>
              {product.quantity} pieces remaining
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.gridCard}>
          <View style={styles.gridImageWrapper}>
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.gridImage}
            />
          </View>

          <View style={styles.gridContent}>
            <Text style={styles.gridName}>{product.name}</Text>

            <Text style={styles.gridDescription}>{product.description}</Text>

            <View style={styles.gridRow}>
              <Text style={styles.gridVendor}>
                Vendor: {product.seller.name}
              </Text>

              <Pressable>
                <Ionicons color={Colors.primary} name="chatbubble" size={20} />
              </Pressable>
            </View>

            <Text style={styles.gridPrice}>{formatNaira(product.price)}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  horizontalCard: {
    padding: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: Colors.background,
  },
  horizontalImageWrapper: {
    backgroundColor: Colors.secondary2,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalImage: {
    width: 100,
    height: 80,
  },
  horizontalContent: {
    marginTop: 10,
  },
  horizontalName: {
    fontFamily: "Lato_700Bold",
    fontSize: 12,
  },
  horizontalPrice: {
    fontFamily: "Lato_700Bold",
    fontSize: 14,
  },
  horizontalStock: {
    fontFamily: "Lato_400Regular",
    fontSize: 8,
  },

  gridCard: {
    padding: 10,
  },
  gridImageWrapper: {
    paddingVertical: 20,
    backgroundColor: Colors.secondary2,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  gridImage: {
    width: 120,
    height: 160,
  },
  gridContent: {
    marginTop: 10,
  },
  gridName: {
    fontFamily: "Lato_700Bold",
    fontSize: 16,
  },
  gridDescription: {
    fontFamily: "Lato_400Regular",
    fontSize: 10,
    color: Colors.secondary2,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gridVendor: {
    fontFamily: "Lato_700Bold",
    fontSize: 10,
  },
  gridPrice: {
    fontFamily: "Lato_700Bold",
    fontSize: 12,
  },
});
