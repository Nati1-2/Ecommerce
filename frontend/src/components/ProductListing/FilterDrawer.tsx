"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw } from "lucide-react";
import { FilterSidebar, FilterState } from "./FilterSidebar";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  availableBrands: string[];
  availableCategories: string[];
}

export function FilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  onClear,
  availableBrands,
  availableCategories,
}: FilterDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-[320px] bg-white z-50 shadow-2xl flex flex-col lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
              <span className="text-lg font-bold text-gray-900">Filters</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClear}
                  className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-colors"
                  title="Reset Filters"
                >
                  <RotateCcw className="w-4.5 h-4.5" />
                </button>
                <button onClick={onClose}>
                  <X className="w-5 h-5 text-gray-500 hover:text-gray-900" />
                </button>
              </div>
            </div>

            {/* Content body */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Force children block view so mobile version renders sidebar in scroll container */}
              <div className="block lg:block">
                <FilterSidebar
                  filters={filters}
                  onChange={onChange}
                  onClear={onClear}
                  availableBrands={availableBrands}
                  availableCategories={availableCategories}
                />
              </div>
            </div>

            {/* Action footer */}
            <div className="p-4 border-t border-gray-100 shrink-0">
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-[#007BFF] hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 text-sm"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
