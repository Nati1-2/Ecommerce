"use client";

import { useState } from "react";
import { useAdminProductStore } from "@/store/adminProductStore";
import { useCategories, useAddCategory } from "@/hooks/useAdminProductQuery";
import { Layers, X, Plus, Folder, Trash2 } from "lucide-react";

export default function CategoryManager() {
  const { isCategoryManagerOpen, setIsCategoryManagerOpen } = useAdminProductStore();
  const { data: categories = [], isLoading } = useCategories();
  const addCategoryMutation = useAddCategory();
  const [newCatName, setNewCatName] = useState("");

  if (!isCategoryManagerOpen) return null;

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      addCategoryMutation.mutate(newCatName.trim());
      setNewCatName("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Marketplace Category Taxonomy
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Manage catalog categories & hierarchy</p>
            </div>
          </div>
          <button onClick={() => setIsCategoryManagerOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="New Category Name (e.g. Wearables)"
            className="flex-1 px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            disabled={!newCatName.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>

        {/* Categories List */}
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Folder className="w-4 h-4 text-blue-500" />
                  <span>{cat.name}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 font-mono">
                  {cat.productCount.toLocaleString()} products
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {cat.subcategories.map((sub) => (
                  <span key={sub} className="text-[10px] font-semibold px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            onClick={() => setIsCategoryManagerOpen(false)}
            className="px-4 py-2 font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
