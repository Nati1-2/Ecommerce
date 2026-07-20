// Search mock API and types

export interface ProductResult {
  id: string;
  name: string;
  image: string[];
  brand: string;
  price: number;
  discount: number;
  rating: number;
  reviews: number;
  stock: number;
  category: string;
}

export interface SearchResult {
  query: string;
  total: number;
  products: ProductResult[];
  processingTime: number;
}

// Mock Data
const MOCK_PRODUCTS: ProductResult[] = [
  { id: "p1", name: "Apple iPhone 16 Pro", brand: "Apple", price: 1099, discount: 0, rating: 4.8, reviews: 1240, stock: 50, image: ["/iphone.png"], category: "Electronics" },
  { id: "p2", name: "Apple iPhone 15", brand: "Apple", price: 799, discount: 10, rating: 4.7, reviews: 856, stock: 120, image: ["/iphone15.png"], category: "Electronics" },
  { id: "p3", name: "Samsung Galaxy S24 Ultra", brand: "Samsung", price: 1199, discount: 5, rating: 4.9, reviews: 320, stock: 45, image: ["/s24.png"], category: "Electronics" },
  { id: "p4", name: "Sony WH-1000XM5 Headphones", brand: "Sony", price: 398, discount: 20, rating: 4.6, reviews: 2100, stock: 80, image: ["/sony-headphones.png"], category: "Electronics" },
  { id: "p5", name: "Razer Blade 16 Gaming Laptop", brand: "Razer", price: 2999, discount: 0, rating: 4.5, reviews: 150, stock: 15, image: ["/razer-laptop.png"], category: "Computers" },
  { id: "p6", name: "Apple MacBook Pro M3 Max", brand: "Apple", price: 3499, discount: 0, rating: 4.9, reviews: 410, stock: 22, image: ["/macbook.png"], category: "Computers" },
  { id: "p7", name: "iPhone 16 Clear Case with MagSafe", brand: "Apple", price: 49, discount: 0, rating: 4.3, reviews: 540, stock: 200, image: ["/iphone-case.png"], category: "Accessories" },
  { id: "p8", name: "Nintendo Switch OLED", brand: "Nintendo", price: 349, discount: 10, rating: 4.8, reviews: 8900, stock: 0, image: ["/switch.png"], category: "Gaming" },
];

export const searchApi = {
  search: async (query: string, filters?: any): Promise<SearchResult> => {
    // Simulate Meilisearch network latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    const startTime = performance.now();
    const q = query.toLowerCase();
    
    let filtered = MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));

    // Apply filters
    if (filters) {
      if (filters.category?.length) {
        filtered = filtered.filter(p => filters.category.includes(p.category));
      }
      if (filters.brand?.length) {
        filtered = filtered.filter(p => filters.brand.includes(p.brand));
      }
      if (filters.priceRange) {
        filtered = filtered.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
      }
      if (filters.rating) {
        filtered = filtered.filter(p => p.rating >= filters.rating);
      }
      if (filters.availability !== null) {
        if (filters.availability) {
          filtered = filtered.filter(p => p.stock > 0);
        } else {
          filtered = filtered.filter(p => p.stock === 0);
        }
      }
      if (filters.discount) {
         filtered = filtered.filter(p => p.discount >= filters.discount);
      }
    }

    const endTime = performance.now();

    return {
      query,
      total: filtered.length,
      products: filtered,
      processingTime: Number(((endTime - startTime) / 1000).toFixed(3)),
    };
  },

  getSuggestions: async (query: string) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const q = query.toLowerCase();
    
    // Extract products, brands, categories
    const products = MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(q)).slice(0, 3);
    const brands = Array.from(new Set(MOCK_PRODUCTS.map(p => p.brand))).filter(b => b.toLowerCase().includes(q));
    const categories = Array.from(new Set(MOCK_PRODUCTS.map(p => p.category))).filter(c => c.toLowerCase().includes(q));

    return { products, brands, categories };
  },

  getPopularSearches: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return ["iPhone", "MacBook", "Gaming PC", "Smart Watch"];
  },

  getRecommendations: async (query?: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Just return some random highly rated items
    return [...MOCK_PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 4);
  }
};
