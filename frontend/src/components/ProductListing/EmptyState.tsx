"use client";

import { motion } from "framer-motion";
import { AlertCircle, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-gray-100 shadow-sm"
    >
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#007BFF] mb-5">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-black text-gray-900 leading-snug">No products found</h3>
      <p className="text-gray-500 text-sm mt-2 max-w-sm">
        We couldn't find any products matching your selected filters. Try broadening your criteria.
      </p>
      <button
        onClick={onClearFilters}
        className="inline-flex items-center gap-2 mt-6 bg-[#007BFF] hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5 text-sm"
      >
        <RotateCcw className="w-4 h-4" />
        Reset All Filters
      </button>
    </motion.div>
  );
}
