"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/services/api/search";
import { useSearchStore } from "@/store/searchStore";
import SearchFilters from "./SearchFilters";
import SearchToolbar from "./SearchToolbar";
import SearchResults from "./SearchResults";
import Pagination from "./Pagination";
import SearchSkeleton from "./SearchSkeleton";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 8; // Adjust based on grid layout

  const setQuery = useSearchStore((s) => s.setQuery);
  const filters = useSearchStore((s) => s.filters);
  const sort = useSearchStore((s) => s.sort);
  const viewMode = useSearchStore((s) => s.viewMode);

  // Sync URL query with store
  useEffect(() => {
    setQuery(query);
  }, [query, setQuery]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", query, filters, sort, page],
    queryFn: () => searchApi.search(query, filters),
    enabled: true, // Always run, even if query is empty, as users can browse
  });

  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-black text-gray-900 mb-2">Search unavailable</h1>
        <p className="text-gray-500 mb-6">We're having trouble reaching the search servers. Please try again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Handle Pagination slicing
  const products = data?.products || [];
  
  // Actually, we should apply sorting to the products here since mock API doesn't do it.
  // In a real MeiliSearch, the backend would handle sorting and pagination.
  const sortedProducts = [...products].sort((a, b) => {
    switch (sort) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "newest": return b.id.localeCompare(a.id); // Mock newer
      case "popular": return b.reviews - a.reviews;
      default: return 0; // relevance
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 mt-24">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {query ? `Results for "${query}"` : "All Products"}
          </h1>
          <p className="text-sm font-semibold text-gray-500">
            {data?.total ?? 0} products found
            {data?.processingTime && (
              <span className="text-gray-400 font-normal">
                {" "}• {data.processingTime} seconds
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <SearchFilters />

        <div className="flex-1 w-full min-w-0">
          <SearchToolbar totalResults={data?.total ?? 0} />
          
          {isLoading ? (
            <SearchSkeleton viewMode={viewMode} />
          ) : (
            <>
              <SearchResults products={paginatedProducts} />
              <Pagination currentPage={page} totalPages={totalPages} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
