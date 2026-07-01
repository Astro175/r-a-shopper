import ProductCard from "@/components/ProductCard";
import SupplierCard from "@/components/SupplierCard";
import { Colors } from "@/constants/colors";
import { useProducts } from "@/hooks/useProducts";
import { useSupplier } from "@/hooks/useSupplier";
import Ionicons, {
  IoniconsIconName,
} from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CategoryItem = {
  name: string;
  icon: IoniconsIconName;
};

const CATEGORIES: CategoryItem[] = [
  { name: "Hand tool", icon: "build-outline" },
  { name: "Networking Equipment", icon: "git-network-outline" },
  { name: "Safety Equipment", icon: "shield-checkmark-outline" },
  { name: "Test Instrument", icon: "flask-outline" },
  { name: "Power system", icon: "flash-outline" },
];

const HomeScreen = () => {
  const { data } = useProducts({ limit: 10, sortBy: "New Today" });
  const products = data?.pages.flatMap((page) => page.products);
  const { data: suppliers } = useSupplier();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <FlatList
          data={CATEGORIES}
          horizontal
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <Pressable
              style={styles.categoryItem}
              onPress={() =>
                router.push({
                  pathname: "/(buyer)/(market)/",
                  params: { category: item.name },
                })
              }
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons name={item.icon} color={Colors.primary} />
              </View>
              <Text style={styles.categoryText}>{item.name}</Text>
            </Pressable>
          )}
        />

        <Text style={styles.sectionTitle}>Recently Added</Text>
        <FlatList
          data={products}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              variant="horizontal"
              onPress={() =>
                router.push({
                  pathname: "/(buyer)/product/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
        />
        <View style={styles.spacer} />
        <Text style={styles.sectionTitle}>Top Suppliers</Text>

        <FlatList
          keyExtractor={(item) => item.id}
          data={suppliers}
          horizontal
          renderItem={({ item }) => <SupplierCard supplier={item} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 10,
    color: Colors.text,
    fontFamily: "Lato_700Bold",
    fontSize: 16,
  },
  spacer: {
    marginVertical: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 12,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.secondary2,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    color: Colors.textSecondary,
    fontFamily: "Lato_400Regular",
    fontSize: 10,
    marginTop: 6,
  },
});

export default HomeScreen;
