"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartApi } from "@/services/api/cartApi";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  cartDrawerOpen: boolean;
  isSyncing: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  initialize: () => Promise<void>;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartDrawerOpen: false,
      isSyncing: false,
      setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
      
      initialize: async () => {
        set({ isSyncing: true });
        try {
          await cartApi.mergeCart();
          const items = await cartApi.getCart();
          set({ items, isSyncing: false });
        } catch (error) {
          console.error("Failed to sync cart", error);
          set({ isSyncing: false });
        }
      },

      addItem: async (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.productId === item.productId);
        
        // Optimistic update
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            cartDrawerOpen: true,
          });
        } else {
          set({ items: [...items, item], cartDrawerOpen: true });
        }

        // Sync to backend
        try {
          const serverItems = await cartApi.addItem(item);
          set({ items: serverItems });
        } catch (error) {
          console.error("Failed to add item to server cart", error);
          // Rollback on error could be implemented here
        }
      },

      removeItem: async (productId) => {
        const originalItems = get().items;
        set({ items: originalItems.filter((i) => i.productId !== productId) });
        
        try {
          const serverItems = await cartApi.removeItem(productId);
          set({ items: serverItems });
        } catch (error) {
          set({ items: originalItems }); // rollback
        }
      },

      updateQuantity: async (productId, quantity) => {
        const originalItems = get().items;
        set({
          items: originalItems.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });

        try {
          const serverItems = await cartApi.updateQuantity(productId, quantity);
          set({ items: serverItems });
        } catch (error) {
          set({ items: originalItems }); // rollback
        }
      },

      clearCart: async () => {
        const originalItems = get().items;
        set({ items: [] });
        try {
          await cartApi.clearCart();
        } catch (error) {
          set({ items: originalItems });
        }
      },

      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      
      totalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }), // Persist only items, not the open state
    }
  )
);

