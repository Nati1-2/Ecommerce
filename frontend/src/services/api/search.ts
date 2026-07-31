import { fetchProducts } from "./../../lib/api";
import { Product } from "@/types";

export type ProductResult = Product;

export interface SearchResult {
  query: string;
  total: number;
  products: Product[];
  processingTime: number;
}

export const searchApi = {
  search: async (query: string, filters?: any): Promise<SearchResult> => {
    const startTime = performance.now();
    
    // Map filters to GetProductsParams
    const apiFilters: any = {
      search: query,
      limit: 100, // Fetch more to allow client-side pagination, or delegate to API if possible
    };
    
    if (filters) {
      if (filters.category?.length) apiFilters.category = filters.category;
      if (filters.brand?.length) apiFilters.brands = filters.brand;
      if (filters.priceRange) {
        apiFilters.priceMin = filters.priceRange[0];
        apiFilters.priceMax = filters.priceRange[1];
      }
      if (filters.rating) apiFilters.rating = filters.rating;
      if (filters.availability !== null) apiFilters.inStock = filters.availability;
      if (filters.discount) apiFilters.discount = filters.discount;
    }

    try {
      const response = await fetchProducts(apiFilters);
      const endTime = performance.now();

      return {
        query,
        total: response.total,
        products: response.products,
        processingTime: Number(((endTime - startTime) / 1000).toFixed(3)),
      };
    } catch (error) {
      console.error("Search failed:", error);
      throw error;
    }
  },

  getSuggestions: async (query: string) => {
    try {
      const response = await fetchProducts({ search: query, limit: 5 });
      const products = response.products.slice(0, 3);
      
      // Extract unique brands and categories from results for suggestions
      const brands = Array.from(new Set(response.products.map(p => p.brand).filter(Boolean)));
      const categories = Array.from(new Set(response.products.map(p => p.category).filter(Boolean)));

      return { products, brands, categories };
    } catch (error) {
      return { products: [], brands: [], categories: [] };
    }
  },

  getPopularSearches: async () => {
    return ["iPhone", "MacBook", "Gaming PC", "Smart Watch"];
  },

  getRecommendations: async (query?: string) => {
    try {
      const response = await fetchProducts({ limit: 4, sort: "popular" });
      return response.products;
    } catch (error) {
      return [];
    }
  }
};

