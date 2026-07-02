import { Colors } from "@/constants/colors";
import { useCartStore } from "@/stores/cartStore";
import { formatNaira } from "@/utils/currency";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Image } from "expo-image";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
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
      <SafeAreaView>
        <Text>Cart is empty</Text>
      </SafeAreaView>
    );
  }

  const handleCheckout = () => {};
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.cartItemLayout}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.cartItemImage}
              />
              <View>
                <Text style={styles.productTitle}>{item.name}</Text>
                <View style={styles.cartOperationsContainer}>
                  <Pressable
                    disabled={item.quantity <= 1}
                    onPress={() => {
                      reduceItemQuantity(item.id);
                    }}
                  >
                    <Ionicons
                      name="remove"
                      size={24}
                      color={
                        item.quantity > 1
                          ? Colors.primary
                          : Colors.backgroundTertiary
                      }
                    />
                  </Pressable>
                  <View style={styles.cartQuantityBackground}>
                    <Text style={styles.cartItemQuantityText}>
                      {item.quantity}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => increaseItemQuantity(item.id)}
                    disabled={item.quantity >= item.stockCount}
                  >
                    <Ionicons
                      name="add"
                      size={24}
                      color={
                        item.quantity < item.stockCount
                          ? Colors.primary
                          : Colors.backgroundTertiary
                      }
                    />
                  </Pressable>
                </View>
              </View>
              <View>
                <Text style={styles.cartItemPrice}>
                  {formatNaira(item.price)}
                </Text>
                <View style={styles.deleteCartContainer}>
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
            <>
              <View style={styles.divider} />
              <View>
                <Text style={styles.sectionTitle}>Order Info</Text>
                <View style={styles.totalSection}>
                  <Text style={styles.totalSectionTitle}>Total</Text>
                  <Text style={styles.cartItemPrice}>
                    {formatNaira(totalPrice)}
                  </Text>
                </View>
              </View>
              <View style={styles.spacer} />
            </>
          )}
        />
        <Pressable onPress={handleCheckout} style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Check out</Text>
        </Pressable>
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
    padding: 10,
  },
  cartItemLayout: {
    borderRadius: 16,
    borderColor: Colors.border,
    justifyContent: "space-around",
    flexDirection: "row",
  },
  cartItemImage: {
    width: 80,
    height: 72,
  },
  productTitle: {
    fontFamily: "Lato_400Regular",
    fontSize: 14,
    color: Colors.text,
  },
  cartOperationsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cartItemPrice: {
    fontFamily: "Lato_700Bold",
    color: Colors.primary,
    fontSize: 18,
  },
  cartQuantityBackground: {
    padding: 8,
    borderRadius: 4,
  },
  cartItemQuantityText: {
    fontFamily: "Lato_700Bold",
    color: Colors.background,
    fontSize: 12,
  },
  deleteCartContainer: {
    justifyContent: "flex-end",
  },
  divider: {
    marginVertical: 20,
    height: 2,
    color: Colors.text,
  },
  spacer: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: "Lato_700Bold",
    color: Colors.text,
  },
  totalSection: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  totalSectionTitle: {
    color: Colors.textSecondary,
    fontFamily: "Lato_400Regular",
  },

  checkoutButton: {
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  checkoutButtonText: {
    fontFamily: "Lato_700Bold",
    fontSize: 16,
    color: Colors.primary,
  },
});

export default CartScreen;
