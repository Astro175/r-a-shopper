import { Colors } from "@/constants/colors";
import { useProduct } from "@/hooks/useProduct";
import { useCartStore } from "@/stores/cartStore";
import { formatNaira } from "@/utils/currency";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProductDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, error } = useProduct(id);
  const [itemQuantity, setItemQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Something went wrong. Please try again.</Text>
      </SafeAreaView>
    );
  }
  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={{ uri: product.imageUrl }} style={styles.heroImage} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>{product.name}</Text>

            <View style={styles.quantityContainer}>
              <Pressable
                onPress={handleReduceQuantity}
                disabled={itemQuantity <= 1}
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={28}
                  color={Colors.background}
                  style={styles.quantityIcon}
                />
              </Pressable>

              <Text style={styles.bodyText}>{itemQuantity}</Text>

              <Pressable
                onPress={handleAddQuantity}
                disabled={itemQuantity >= product.quantity}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={28}
                  color={Colors.background}
                  style={styles.quantityIcon}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.spaceBetween}>
            <View style={styles.stars}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Ionicons
                  key={index}
                  name={index < product.rating ? "star" : "star-outline"}
                  color={Colors.yellowPrimary}
                  size={13}
                />
              ))}
            </View>

            <Text style={styles.secondaryText}>
              {product.quantity} pieces in store
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vendor details</Text>

          <View style={styles.vendorContainer}>
            <View style={styles.vendorInfo}>
              <View style={styles.vendorLogoContainer}>
                <Image
                  source={{ uri: product.seller.logoUrl }}
                  style={styles.vendorLogo}
                />
              </View>

              <View>
                <Text style={styles.bodyText}>{product.seller.name}</Text>
                <Text style={styles.secondaryText}>
                  {product.seller.location}
                </Text>
              </View>
            </View>

            <View style={styles.chatContainer}>
              <Pressable style={styles.chatButton}>
                <Text style={styles.chatText}>Chat Vendor</Text>

                <Ionicons name="chatbubbles" size={24} color={Colors.primary} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        <View style={styles.spacer} />

        <View style={styles.footer}>
          <Text style={styles.price}>{formatNaira(product.price)}</Text>

          <Pressable style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  heroImage: {
    width: 300,
    height: 200,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  section: {
    marginTop: 10,
    padding: 10,
  },

  row: {
    flexDirection: "row",
  },

  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },

  sectionTitle: {
    fontFamily: "Lato_700Bold",
    fontSize: 16,
    color: Colors.text,
  },

  bodyText: {
    fontFamily: "Lato_400Regular",
    fontSize: 16,
    color: Colors.text,
  },

  secondaryText: {
    fontFamily: "Lato_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },

  description: {
    fontFamily: "Lato_400Regular",
    fontSize: 14,
    color: Colors.text,
  },

  quantityContainer: {
    width: 115,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundTertiary,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  quantityIcon: {
    borderColor: Colors.secondary,
  },

  vendorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  vendorInfo: {
    gap: 10,
  },

  vendorLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  vendorLogoContainer: {
    alignItems: "flex-start",
  },

  chatContainer: {
    alignItems: "center",
  },

  chatButton: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  chatText: {
    fontFamily: "Lato_400Regular",
    fontSize: 14,
    color: Colors.primary,
  },

  stars: {
    flexDirection: "row",
    gap: 2,
  },

  spacer: {
    flex: 1,
  },

  footer: {
    width: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },

  price: {
    fontFamily: "Lato_700Bold",
    fontSize: 16,
    color: Colors.background,
  },

  addToCartButton: {
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },

  addToCartText: {
    fontFamily: "Lato_700Bold",
    fontSize: 16,
    color: Colors.primary,
  },
});

export default ProductDetails;
