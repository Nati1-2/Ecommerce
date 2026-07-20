"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SearchFilter {
  category: string[];
  brand: string[];
  priceRange: [number, number]; // [min, max]
  rating: number; // minimum rating
  availability: boolean | null; // true: in stock, null: any
  discount: number; // minimum discount percentage
}

export interface SearchState {
  query: string;
  recentSearches: string[];
  filters: SearchFilter;
  sort: string;
  viewMode: "grid" | "list";

  setQuery: (query: string) => void;
  addRecentSearch: (term: string) => void;
  removeRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;

  setFilters: (filters: Partial<SearchFilter>) => void;
  clearFilters: () => void;
  setSort: (sort: string) => void;
  setViewMode: (mode: "grid" | "list") => void;
}

const initialFilters: SearchFilter = {
  category: [],
  brand: [],
  priceRange: [0, 10000],
  rating: 0,
  availability: null,
  discount: 0,
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      query: "",
      recentSearches: ["iphone 16", "gaming laptop", "headphones", "smart watch"],
      filters: initialFilters,
      sort: "relevance",
      viewMode: "grid",

      setQuery: (query) => set({ query }),

      addRecentSearch: (term) => {
        const trimmed = term.trim().toLowerCase();
        if (!trimmed) return;
        const current = get().recentSearches.filter((s) => s !== trimmed);
        set({ recentSearches: [trimmed, ...current].slice(0, 8) });
      },

      removeRecentSearch: (term) =>
        set({ recentSearches: get().recentSearches.filter((s) => s !== term) }),

      clearRecentSearches: () => set({ recentSearches: [] }),

      setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
      clearFilters: () => set({ filters: initialFilters }),
      setSort: (sort) => set({ sort }),
      setViewMode: (viewMode) => set({ viewMode }),
    }),
    {
      name: "search-storage",
      partialize: (state) => ({ recentSearches: state.recentSearches, viewMode: state.viewMode }),
    }
  )
);
