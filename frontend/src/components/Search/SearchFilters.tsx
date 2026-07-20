"use client";

import { useSearchStore } from "@/store/searchStore";
import { Filter, X, Check } from "lucide-react";
import { useState } from "react";

const CATEGORIES = ["Electronics", "Computers", "Fashion", "Home", "Accessories", "Gaming", "Beauty"];
const BRANDS = ["Apple", "Samsung", "Sony", "Razer", "Nintendo", "Nike", "Adidas"];
const DISCOUNTS = [10, 20, 50];

export default function SearchFilters() {
  const { filters, setFilters, clearFilters } = useSearchStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCategory = (cat: string) => {
    const current = filters.category;
    const next = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat];
    setFilters({ category: next });
  };

  const toggleBrand = (brand: string) => {
    const current = filters.brand;
    const next = current.includes(brand) ? current.filter((b) => b !== brand) : [...current, brand];
    setFilters({ brand: next });
  };

  const activeFiltersCount = 
    filters.category.length + 
    filters.brand.length + 
    (filters.rating > 0 ? 1 : 0) + 
    (filters.availability !== null ? 1 : 0) + 
    (filters.discount > 0 ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Header (Mobile) & Clear */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900">Filters</h3>
        {activeFiltersCount > 0 && (
          <button onClick={clearFilters} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
            Clear all ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Category</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${filters.category.includes(cat) ? "bg-[#111827] border-[#111827]" : "border-gray-300 group-hover:border-gray-400"}`}>
                {filters.category.includes(cat) && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={filters.category.includes(cat)} onChange={() => toggleCategory(cat)} />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Brand</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${filters.brand.includes(brand) ? "bg-[#111827] border-[#111827]" : "border-gray-300 group-hover:border-gray-400"}`}>
                {filters.brand.includes(brand) && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={filters.brand.includes(brand)} onChange={() => toggleBrand(brand)} />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={filters.priceRange[0]} 
            onChange={(e) => setFilters({ priceRange: [Number(e.target.value), filters.priceRange[1]] })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" 
          />
          <span className="text-gray-400">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={filters.priceRange[1]} 
            onChange={(e) => setFilters({ priceRange: [filters.priceRange[0], Number(e.target.value)] })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" 
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Minimum Rating</h4>
        <div className="flex gap-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilters({ rating: filters.rating === rating ? 0 : rating })}
              className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${filters.rating === rating ? "bg-yellow-400 text-yellow-900" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
            >
              {rating}+ ⭐
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Availability</h4>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${filters.availability === true ? "bg-[#111827] border-[#111827]" : "border-gray-300 group-hover:border-gray-400"}`}>
            {filters.availability === true && <Check className="w-3.5 h-3.5 text-white" />}
          </div>
          <input type="checkbox" className="hidden" checked={filters.availability === true} onChange={() => setFilters({ availability: filters.availability === true ? null : true })} />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">In Stock</span>
        </label>
      </div>

      {/* Discount */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Discount</h4>
        <div className="flex flex-wrap gap-2">
          {DISCOUNTS.map((pct) => (
            <button
              key={pct}
              onClick={() => setFilters({ discount: filters.discount === pct ? 0 : pct })}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${filters.discount === pct ? "bg-red-500 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
            >
              {pct}% off or more
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 mb-6"
      >
        <Filter className="w-4 h-4" />
        Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 bg-white p-6 rounded-3xl border border-gray-100 h-fit sticky top-24">
        <FilterContent />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-lg">Filters</h2>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <FilterContent />
            </div>
            <div className="p-4 border-t border-gray-100">
              <button onClick={() => setMobileOpen(false)} className="w-full py-3 bg-[#111827] text-white rounded-xl font-bold">
                View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
