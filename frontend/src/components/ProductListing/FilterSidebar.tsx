"use client";

import { Star } from "lucide-react";
import { RatingStars } from "@/components/shared/RatingStars";

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number | null;
  inStock: boolean | null;
  discount: number | null;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  availableBrands: string[];
  availableCategories: string[];
}

export function FilterSidebar({
  filters,
  onChange,
  onClear,
  availableBrands,
  availableCategories,
}: FilterSidebarProps) {
  const toggleCategory = (cat: string) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  };

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands: next });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
    const val = parseInt(e.target.value) || 0;
    const nextRange: [number, number] =
      type === "min"
        ? [Math.min(val, filters.priceRange[1]), filters.priceRange[1]]
        : [filters.priceRange[0], Math.max(val, filters.priceRange[0])];
    onChange({ ...filters, priceRange: nextRange });
  };

  return (
    <aside className="w-64 shrink-0 space-y-7 hidden lg:block">
      {/* Active filters header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="font-black text-base text-[#111827]">Filters</h3>
        <button
          onClick={onClear}
          className="text-xs font-bold text-[#007BFF] hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</h4>
        <div className="space-y-2">
          {availableCategories.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 text-sm font-semibold text-gray-700 cursor-pointer hover:text-[#007BFF] transition-colors">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4.5 h-4.5 rounded border-gray-300 text-[#007BFF] focus:ring-[#007BFF]/30 cursor-pointer"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price Range</h4>
        <div className="space-y-2.5">
          <div className="flex gap-2">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-gray-400">MIN</span>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(e, "min")}
                className="w-full mt-0.5 px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
              />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-gray-400">MAX</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(e, "max")}
                className="w-full mt-0.5 px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
              />
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={3000}
            step={50}
            value={filters.priceRange[1]}
            onChange={(e) => onChange({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#007BFF]"
          />
        </div>
      </div>

      {/* Brand Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Brand</h4>
        <div className="space-y-2">
          {availableBrands.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 text-sm font-semibold text-gray-700 cursor-pointer hover:text-[#007BFF] transition-colors">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4.5 h-4.5 rounded border-gray-300 text-[#007BFF] focus:ring-[#007BFF]/30 cursor-pointer"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Rating</h4>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <button
              key={rating}
              onClick={() => onChange({ ...filters, rating: filters.rating === rating ? null : rating })}
              className={`flex items-center gap-2 w-full text-left text-sm font-semibold py-1 hover:text-[#007BFF] transition-colors ${
                filters.rating === rating ? "text-[#007BFF]" : "text-gray-700"
              }`}
            >
              <RatingStars rating={rating} />
              <span>& Up ({rating})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Availability</h4>
        <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-700 cursor-pointer hover:text-[#007BFF] transition-colors">
          <input
            type="checkbox"
            checked={filters.inStock === true}
            onChange={() => onChange({ ...filters, inStock: filters.inStock === true ? null : true })}
            className="w-4.5 h-4.5 rounded border-gray-300 text-[#007BFF] focus:ring-[#007BFF]/30 cursor-pointer"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Discount Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Discount</h4>
        <div className="space-y-2">
          {[10, 20, 30, 50].map((discountVal) => (
            <button
              key={discountVal}
              onClick={() => onChange({ ...filters, discount: filters.discount === discountVal ? null : discountVal })}
              className={`block w-full text-left text-sm font-semibold py-1 hover:text-[#007BFF] transition-colors ${
                filters.discount === discountVal ? "text-[#007BFF]" : "text-gray-700"
              }`}
            >
              {discountVal}% Off or More
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
