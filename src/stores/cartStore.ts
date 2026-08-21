import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  sellerName: string;
  stockCount: number;
};

type useCartStoreShape = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  reduceItemQuantity: (id: string) => void;
  increaseItemQuantity: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<useCartStoreShape>()(
  persist(
    (set) => ({
      cart: [],
      addToCart(item) {
        set((state) => {
          const foundProduct = state.cart.find(
            (product) => product.id === item.id,
          );
          if (foundProduct) {
            return {
              cart: state.cart.map((p) =>
                p.id === item.id ? { ...item, quantity: item.quantity + 1 } : p,
              ),
            };
          } else {
            return { cart: [...state.cart, { ...item }] };
          }
        });
      },
      removeFromCart(id) {
        set((state) => ({
          ...state,
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      clearCart() {
        set({ cart: [] });
      },

      reduceItemQuantity(id) {
        set((state) => {
          const foundProduct = state.cart.find((item) => item.id === id);
          if (foundProduct && foundProduct.quantity > 1) {
            return {
              cart: state.cart.map((item) =>
                item.id === id
                  ? { ...foundProduct, quantity: item.quantity - 1 }
                  : item,
              ),
            };
          } else {
            return state;
          }
        });
      },
      increaseItemQuantity(id) {
        set((state) => {
          const foundProduct = state.cart.find((item) => item.id === id);
          if (foundProduct && foundProduct.quantity < foundProduct.stockCount) {
            return {
              cart: state.cart.map((item) =>
                item.id === id
                  ? { ...foundProduct, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          } else {
            return state;
          }
        });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
