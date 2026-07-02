import { Colors } from "@/constants/colors";
import { useCartStore } from "@/stores/cartStore";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Tabs } from "expo-router";

const BuyerLayout = () => {
  const totalItems = useCartStore((state) =>
    state.cart.reduce((sum, item) => sum + item.quantity, 0),
  );
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.secondary,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Ionicons name="home" size={size} color={color} />
            ) : (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="(market)"
        options={{
          title: "Market",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Ionicons name="compass" size={size} color={color} />
            ) : (
              <Ionicons name="compass-outline" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Ionicons name="cart" color={color} size={size} />
            ) : (
              <Ionicons name="cart-outline" color={color} size={size} />
            ),
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Ionicons name="chatbubbles" size={size} color={color} />
            ) : (
              <Ionicons name="chatbubbles-outline" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Ionicons name="person" size={size} color={color} />
            ) : (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
        }}
      />
    </Tabs>
  );
};

export default BuyerLayout;
