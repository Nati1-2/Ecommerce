"use client";

import { useAdminProductStore } from "@/store/adminProductStore";
import { Search, RefreshCw, CheckCircle2, Trash2, XCircle } from "lucide-react";
import { useAdminProducts } from "@/hooks/useAdminProductQuery";

interface Props {
  selectedCount: number;
  onBulkApprove: () => void;
  onBulkDelete: () => void;
}

export default function ProductFilters({ selectedCount, onBulkApprove, onBulkDelete }: Props) {
  // Fetch products to derive dynamic categories
  const { data: products = [] } = useAdminProducts();
  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  const {
    filters,
    setSearchQuery,
    setStatusFilter,
    setCategoryFilter,
    setVendorFilter,
    setDateFilter,
    resetFilters,
  } = useAdminProductStore();

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, SKU, vendor, category, or ID..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 font-medium"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Status Filter */}
          <select
            value={filters.statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Approval</option>
            <option value="Approved">Approved Published</option>
            <option value="Reported">Reported Flags</option>
            <option value="Rejected">Rejected</option>
            <option value="Draft">Draft</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
          >
             <option value="All">All Categories</option>
             {categories.map((cat) => (
               <option key={cat} value={cat}>{cat}</option>
             ))}
          </select>

          {/* Vendor Filter */}
          <select
            value={filters.vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Vendors</option>
            <option value="Apex Tech Labs">Apex Tech Labs</option>
            <option value="Quantum Sound Audio">Quantum Sound Audio</option>
            <option value="Hyperion Ergonomics">Hyperion Ergonomics</option>
            <option value="Aura Wearable Tech">Aura Wearable Tech</option>
          </select>

          {/* Date Filter */}
          <select
            value={filters.dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="Week">This Week</option>
            <option value="Month">This Month</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Reset Filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bulk Actions Banner */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl animate-fade-in text-xs">
          <span className="font-bold text-blue-900 dark:text-blue-200">
            {selectedCount} catalog product{selectedCount > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onBulkApprove}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approve Selected
            </button>
            <button
              onClick={onBulkDelete}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
