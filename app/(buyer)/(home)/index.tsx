import SmallLogoIcon from "@/components/icons/SmallLogoIcon";
import ProductCard from "@/components/ProductCard";
import SupplierCard from "@/components/SupplierCard";
import { Colors } from "@/constants/colors";
import { useProducts } from "@/hooks/useProducts";
import { useSupplier } from "@/hooks/useSupplier";
import { useAuthStore } from "@/stores/authStore";
import Ionicons, {
  IoniconsIconName,
} from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
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
  const { data, error } = useProducts({ limit: 10 });
  const products = data?.pages.flatMap((page) => page.products);
  const session = useAuthStore((state) => state.session);

  const { data: suppliers } = useSupplier();

  return (
    <SafeAreaView className="flex-1 p-2.5 bg-white">
      <ScrollView className="flex-1">
        <View className="my-4 flex-row justify-between border-b border-b-blue-50 pb-2">
          <SmallLogoIcon />
          <View className="flex-row-reverse gap-2">
            <View className="h-[45] w-[45] bg-secondary2 rounded-full items-center justify-center">
              <Ionicons name="notifications-outline" size={24} color="black" />
            </View>
            <View className="h-[45] w-[45] bg-secondary2 rounded-full items-center justify-center">
              <Text className="uppercase text-sm font-lato-bold text-black">
                {session?.email.slice(0, 2)}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Pressable
            className="p-4 bg-[#F3F4F9] my-4 py-5 rounded-full flex-row items-center"
            onPress={() =>
              router.push({
                pathname: "/(buyer)/(market)",
                params: { focusSearch: "true" },
              })
            }
          >
            <View className="flex-row gap-4">
              <Ionicons name="search-outline" size={20} />
              <Text className="text-[#86869E] font-lato ">
                Search for all your engineering supplies
              </Text>
            </View>
          </Pressable>
        </View>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <Pressable
              className="mr-3 items-center"
              onPress={() =>
                router.push({
                  pathname: "/(buyer)/(market)",
                  params: { category: item.name },
                })
              }
            >
              <View className="h-[60px] w-[60px] items-center justify-center rounded-full bg-secondary2">
                <Ionicons name={item.icon} size={24} color={Colors.primary} />
              </View>

              <Text className="mt-1.5 font-lato text-[10px] text-textSecondary">
                {item.name}
              </Text>
            </Pressable>
          )}
        />
        <View className="my-3" />
        <Text className="my-4 font-lato-bold text-[16px] text-text ">
          Recently Added
        </Text>

        <FlatList
          ItemSeparatorComponent={() => <View className="w-3" />}
          data={products}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              variant="horizontal"
              onPress={() =>
                router.push({
                  pathname: "/product/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
        />

        <View className="my-5" />
        <Text className="mb-2.5 font-lato-bold text-[16px] text-text">
          Top Suppliers
        </Text>

        <FlatList
          data={suppliers}
          horizontal
          ItemSeparatorComponent={() => <View className="w-3" />}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SupplierCard supplier={item} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
