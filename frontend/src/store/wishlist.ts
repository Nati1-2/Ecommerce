"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviewsCount: number;
  stock: number; // 0 = out of stock, >0 = in stock
  addedAt: string;
  category: string;
  priceAlertEnabled?: boolean;
}

interface WishlistFilters {
  query: string;
  category: string;
  availability: string;
}

interface WishlistState {
  items: WishlistItem[];
  filters: WishlistFilters;
  sort: string;
  collections: string[];
  addItem: (item: Partial<WishlistItem> & { productId: string }) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string, itemData?: Partial<WishlistItem>) => void;
  isWishlisted: (productId: string) => boolean;
  setFilters: (filters: Partial<WishlistFilters>) => void;
  setSort: (sort: string) => void;
  addCollection: (name: string) => void;
  removeCollection: (name: string) => void;
  togglePriceAlert: (productId: string) => void;
  clearWishlist: () => void;
}

// Initial mock favorites for new users (empty by default)
const initialItems: WishlistItem[] = [];

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [...initialItems],
      filters: {
        query: "",
        category: "All",
        availability: "All",
      },
      sort: "Recently added",
      collections: ["Gaming Setup", "Home Office", "Gift Ideas"],

      addItem: (item) => {
        const { items } = get();
        if (items.some((i) => i.productId === item.productId)) return;

        const newItem: WishlistItem = {
          id: `wish-${Date.now()}`,
          productId: item.productId,
          name: item.name || "Nati Premium Product",
          brand: item.brand || "Nati",
          image: item.image || "/iphone17.png",
          price: item.price || 99.0,
          oldPrice: item.oldPrice || item.price || 99.0,
          rating: item.rating || 4.5,
          reviewsCount: item.reviewsCount || 10,
          stock: item.stock ?? 5,
          addedAt: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          category: item.category || "Electronics",
          priceAlertEnabled: false,
        };

        set({ items: [...items, newItem] });
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      toggleItem: (productId, itemData) => {
        const { items, addItem, removeItem } = get();
        const exists = items.some((i) => i.productId === productId);
        if (exists) {
          removeItem(productId);
        } else {
          addItem({ productId, ...itemData });
        }
      },

      isWishlisted: (productId) => get().items.some((i) => i.productId === productId),

      setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),

      setSort: (sort) => set({ sort }),

      addCollection: (name) => {
        const { collections } = get();
        if (collections.includes(name)) return;
        set({ collections: [...collections, name] });
      },

      removeCollection: (name) =>
        set({ collections: get().collections.filter((c) => c !== name) }),

      togglePriceAlert: (productId) =>
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, priceAlertEnabled: !i.priceAlertEnabled }
              : i
          ),
        }),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "wishlist-storage-2026" }
  )
);
