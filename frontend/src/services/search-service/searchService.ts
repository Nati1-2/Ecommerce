import { searchEngine, SearchableProduct, SearchOptions } from "@/lib/searchEngine";

export const searchService = {
  executeSearch: (products: SearchableProduct[], options: SearchOptions) => {
    return searchEngine.search(products, options);
  },

  getSuggestions: (products: SearchableProduct[], input: string) => {
    return searchEngine.getSuggestions(products, input);
  },
};
