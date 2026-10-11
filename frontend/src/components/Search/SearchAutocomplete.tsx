import { motion } from "framer-motion";
import { Search, ArrowRight, History, Flame, Tag } from "lucide-react";
import Link from "next/link";
import { ProductResult } from "@/services/api/search";

interface SearchAutocompleteProps {
  query: string;
  isOpen: boolean;
  suggestions: { products: ProductResult[]; brands: string[]; categories: string[] } | null;
  recentSearches: string[];
  popularSearches: string[];
  isLoading: boolean;
  onClose: () => void;
  onSearch: (q: string) => void;
}

export default function SearchAutocomplete({
  query,
  isOpen,
  suggestions,
  recentSearches,
  popularSearches,
  isLoading,
  onClose,
  onSearch,
}: SearchAutocompleteProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-50 flex"
      style={{ minHeight: "300px" }}
    >
      {/* Left side: Suggestions / Recent */}
      <div className="w-1/2 p-4 border-r border-slate-100 dark:border-slate-800">
        {!query ? (
          <div className="space-y-6">
            {recentSearches.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Recent Searches</h4>
                <ul className="space-y-2">
                  {recentSearches.map((s, i) => (
                    <li key={i}>
                      <button
                        onClick={() => onSearch(s)}
                        className="flex items-center gap-3 w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <History className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium">{s}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Trending Searches</h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => onSearch(s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200/60 dark:border-orange-900/40 text-xs font-semibold hover:bg-orange-100 transition-colors"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {suggestions?.categories.length ? (
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Categories</h4>
                <ul className="space-y-1">
                  {suggestions.categories.map((c, i) => (
                    <li key={i}>
                      <button
                        onClick={() => onSearch(c)}
                        className="flex items-center justify-between w-full text-left px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 group transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                          <span className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">{c}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {suggestions?.brands.length ? (
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Brands</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestions.brands.map((b, i) => (
                    <button
                      key={i}
                      onClick={() => onSearch(b)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {(!suggestions?.categories.length && !suggestions?.brands.length && !suggestions?.products.length) && (
              <p className="text-sm text-slate-500 text-center py-8">No matching categories or brands.</p>
            )}
          </div>
        )}
      </div>

      {/* Right side: Product Previews */}
      <div className="w-1/2 p-4 bg-slate-50/50 dark:bg-slate-800/40">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Products</h4>
          {query && suggestions?.products.length ? (
             <button onClick={() => onSearch(query)} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
               View all
             </button>
          ) : null}
        </div>
        
        {query && !isLoading && suggestions?.products.length ? (
          <ul className="space-y-3">
            {suggestions.products.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/products/${p.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all group"
                >
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{p.brand}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.name}</p>
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    ${p.price}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : query && !isLoading ? (
           <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-50">
             <Search className="w-8 h-8 text-slate-400" />
             <p className="text-sm font-medium text-slate-500">No products found</p>
           </div>
        ) : (
           <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-50">
             <Search className="w-8 h-8 text-slate-400" />
             <p className="text-sm font-medium text-slate-500">Start typing to see product previews</p>
           </div>
        )}
      </div>

      {/* Powered by Meilisearch branding */}
      <div className="absolute bottom-0 right-0 left-0 h-8 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end px-4">
        <div className="flex items-center gap-1.5 opacity-60">
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Powered by</span>
          <span className="text-xs font-black text-[#FF5A5F]">Meilisearch</span>
        </div>
      </div>
    </motion.div>
  );
}
