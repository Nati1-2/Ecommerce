"use client";

import { Grid, List, SlidersHorizontal, X } from "lucide-react";
import { SortDropdown } from "./SortDropdown";
import { FilterState } from "./FilterSidebar";
import { cn } from "@/lib/utils";

interface ProductToolbarProps {
  total: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sort: string;
  onSortChange: (sort: string) => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onOpenMobileFilters: () => void;
  onClearFilters: () => void;
}

export function ProductToolbar({
  total,
  viewMode,
  onViewModeChange,
  sort,
  onSortChange,
  filters,
  onFilterChange,
  onOpenMobileFilters,
  onClearFilters,
}: ProductToolbarProps) {
  // Compute active filter count
  const activeCategoriesCount = filters.categories.length;
  const activeBrandsCount = filters.brands.length;
  const hasPriceFilter = filters.priceRange[0] > 0 || 3000 > filters.priceRange[1];
  const hasRatingFilter = filters.rating !== null;
  const hasAvailabilityFilter = filters.inStock !== null;
  const hasDiscountFilter = filters.discount !== null;

  const totalActiveFilters =
    activeCategoriesCount +
    activeBrandsCount +
    (hasPriceFilter ? 1 : 0) +
    (hasRatingFilter ? 1 : 0) +
    (hasAvailabilityFilter ? 1 : 0) +
    (hasDiscountFilter ? 1 : 0);

  const removeCategory = (cat: string) => {
    onFilterChange({
      ...filters,
      categories: filters.categories.filter((c) => c !== cat),
    });
  };

  const removeBrand = (brand: string) => {
    onFilterChange({
      ...filters,
      brands: filters.brands.filter((b) => b !== brand),
    });
  };

  const clearPriceFilter = () => {
    onFilterChange({
      ...filters,
      priceRange: [0, 3000],
    });
  };

  return (
    <div className="space-y-4">
      {/* Top bar toolbar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
        {/* Left: Total Count & Mobile Filter Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileFilters}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
            {totalActiveFilters > 0 && (
              <span className="bg-[#007BFF] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalActiveFilters}
              </span>
            )}
          </button>
          <span className="text-sm font-bold text-gray-900 hidden sm:inline">
            Showing {total} {total === 1 ? "Product" : "Products"}
          </span>
        </div>

        {/* Right: Sorting and Layout View Toggle */}
        <div className="flex items-center gap-3">
          <SortDropdown value={sort} onChange={onSortChange} />

          <div className="flex border border-gray-200 rounded-xl p-1 bg-gray-50">
            <button
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === "grid" ? "bg-white text-[#007BFF] shadow-sm" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === "list" ? "bg-white text-[#007BFF] shadow-sm" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom active chips filter strip */}
      {totalActiveFilters > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-1">Active:</span>

          {filters.categories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-[#007BFF] border border-blue-100"
            >
              <span>{cat}</span>
              <button onClick={() => removeCategory(cat)} className="hover:text-blue-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          {filters.brands.map((brand) => (
            <span
              key={brand}
              className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-[#007BFF] border border-blue-100"
            >
              <span>{brand}</span>
              <button onClick={() => removeBrand(brand)} className="hover:text-blue-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          {hasPriceFilter && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-[#007BFF] border border-blue-100">
              <span>
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </span>
              <button onClick={clearPriceFilter} className="hover:text-blue-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {hasRatingFilter && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-[#007BFF] border border-blue-100">
              <span>{filters.rating}★ & up</span>
              <button onClick={() => onFilterChange({ ...filters, rating: null })} className="hover:text-blue-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {hasAvailabilityFilter && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-[#007BFF] border border-blue-100">
              <span>In Stock</span>
              <button onClick={() => onFilterChange({ ...filters, inStock: null })} className="hover:text-blue-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {hasDiscountFilter && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-[#007BFF] border border-blue-100">
              <span>&gt;{filters.discount}% Off</span>
              <button onClick={() => onFilterChange({ ...filters, discount: null })} className="hover:text-blue-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button
            onClick={onClearFilters}
            className="text-xs font-bold text-gray-500 hover:text-red-500 transition-colors ml-1 underline"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
