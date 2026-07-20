"use client";

import { ProductResult } from "@/services/api/search";
import SearchProductCard from "./SearchProductCard";
import { useSearchStore } from "@/store/searchStore";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { searchApi } from "@/services/api/search";

interface SearchResultsProps {
  products: ProductResult[];
}

export default function SearchResults({ products }: SearchResultsProps) {
  const viewMode = useSearchStore((s) => s.viewMode);
  const clearFilters = useSearchStore((s) => s.clearFilters);
  const [recommendations, setRecommendations] = useState<ProductResult[]>([]);

  useEffect(() => {
    if (products.length === 0) {
      searchApi.getRecommendations().then(setRecommendations);
    }
  }, [products.length]);

  if (products.length === 0) {
    return (
      <div className="w-full space-y-12">
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">No products found</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            We couldn't find any products matching your current search and filter criteria. Try adjusting your search term or clearing filters.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={clearFilters}
              className="px-6 py-3 rounded-xl font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
            <Link 
              href="/products"
              className="px-6 py-3 rounded-xl font-bold bg-[#111827] text-white hover:bg-gray-800 transition-colors shadow-md shadow-gray-900/10"
            >
              Browse Products
            </Link>
          </div>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div>
            <h3 className="text-xl font-black text-gray-900 mb-6">You may also like</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {recommendations.map(p => (
                <SearchProductCard key={p.id} product={p} viewMode="grid" />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-4">
        {products.map(p => (
          <SearchProductCard key={p.id} product={p} viewMode="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map(p => (
        <SearchProductCard key={p.id} product={p} viewMode="grid" />
      ))}
    </div>
  );
}
