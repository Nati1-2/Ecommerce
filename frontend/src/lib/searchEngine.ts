export interface SearchableProduct {
  id: string;
  name: string;
  category: string;
  brand?: string;
  description?: string;
  price: number;
  rating?: number;
  createdAt?: string;
}

export interface SearchOptions {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "relevance" | "price_asc" | "price_desc" | "rating" | "newest";
}

export const searchEngine = {
  search: (products: SearchableProduct[], options: SearchOptions = {}): SearchableProduct[] => {
    const { query = "", category = "", minPrice, maxPrice, sortBy = "relevance" } = options;

    let filtered = products.filter((p) => {
      if (category && category.toLowerCase() !== "all" && p.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
      if (minPrice !== undefined && p.price < minPrice) return false;
      if (maxPrice !== undefined && p.price > maxPrice) return false;
      return true;
    });

    if (query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      const terms = q.split(/\s+/);

      filtered = filtered
        .map((p) => {
          let score = 0;
          const name = p.name.toLowerCase();
          const cat = p.category.toLowerCase();
          const desc = (p.description || "").toLowerCase();
          const brand = (p.brand || "").toLowerCase();

          if (name === q) score += 100;
          else if (name.startsWith(q)) score += 50;
          else if (name.includes(q)) score += 30;

          terms.forEach((term) => {
            if (name.includes(term)) score += 15;
            if (cat.includes(term)) score += 10;
            if (brand.includes(term)) score += 10;
            if (desc.includes(term)) score += 5;
          });

          return { product: p, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.product);
    }

    // Apply sorting
    if (sortBy === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return filtered;
  },

  getSuggestions: (products: SearchableProduct[], input: string, maxSuggestions = 5): string[] => {
    if (!input || input.trim().length < 2) return [];
    const q = input.toLowerCase().trim();
    const suggestions = new Set<string>();

    products.forEach((p) => {
      if (p.name.toLowerCase().includes(q)) suggestions.add(p.name);
      if (p.category.toLowerCase().includes(q)) suggestions.add(p.category);
      if (p.brand && p.brand.toLowerCase().includes(q)) suggestions.add(p.brand);
    });

    return Array.from(suggestions).slice(0, maxSuggestions);
  },
};
