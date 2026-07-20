"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearchStore } from "@/store/searchStore";
import { searchApi, ProductResult } from "@/services/api/search";
import SearchAutocomplete from "./SearchAutocomplete";
import { AnimatePresence } from "framer-motion";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeQuery = useSearchStore((state) => state.query);
  const setStoreQuery = useSearchStore((state) => state.setQuery);
  const addRecentSearch = useSearchStore((state) => state.addRecentSearch);
  const recentSearches = useSearchStore((state) => state.recentSearches);

  const [localQuery, setLocalQuery] = useState(storeQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ products: ProductResult[]; brands: string[]; categories: string[] } | null>(null);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync with URL / Store
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== storeQuery) {
      setStoreQuery(q);
    }
    setLocalQuery(q);
  }, [searchParams, storeQuery, setStoreQuery]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Popular Searches
  useEffect(() => {
    if (isOpen && popularSearches.length === 0) {
      searchApi.getPopularSearches().then(setPopularSearches);
    }
  }, [isOpen, popularSearches.length]);

  // Debounced Suggestions
  useEffect(() => {
    if (!localQuery.trim()) {
      setSuggestions(null);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      searchApi.getSuggestions(localQuery).then((res) => {
        setSuggestions(res);
        setIsLoading(false);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery]);

  const handleSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    
    addRecentSearch(trimmed);
    setIsOpen(false);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", trimmed);
    params.delete("page"); // Reset pagination
    
    router.push(`/search?${params.toString()}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(localQuery);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={wrapperRef}>
      <div 
        className={`relative flex items-center w-full transition-all duration-300 ${
          isOpen ? "bg-white shadow-lg ring-2 ring-blue-500 rounded-t-2xl" : "bg-gray-100/80 hover:bg-gray-100 rounded-full"
        }`}
      >
        <div className="pl-4 pr-3 flex items-center justify-center pointer-events-none">
          <Search className={`w-5 h-5 transition-colors ${isOpen ? "text-blue-500" : "text-gray-400"}`} />
        </div>
        
        <input
          type="text"
          value={localQuery}
          onChange={(e) => {
            setLocalQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search products, brands, categories..."
          className="w-full py-3.5 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
        />

        {localQuery && (
          <button
            onClick={() => {
              setLocalQuery("");
              setSuggestions(null);
            }}
            className="pr-4 pl-2 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <SearchAutocomplete
            query={localQuery}
            isOpen={isOpen}
            suggestions={suggestions}
            recentSearches={recentSearches}
            popularSearches={popularSearches}
            isLoading={isLoading}
            onClose={() => setIsOpen(false)}
            onSearch={handleSearch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
