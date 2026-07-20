"use client";

import { useState } from "react";
import { useWishlistStore } from "@/store/wishlist";
import { FolderHeart, Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WishlistCollections() {
  const { collections, addCollection, removeCollection } = useWishlistStore();
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCol, setSelectedCol] = useState("All Saved");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    addCollection(newCollectionName.trim());
    setNewCollectionName("");
    setShowAddForm(false);
  };

  return (
    <div className="p-6 border border-gray-150 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
          <FolderHeart className="w-4.5 h-4.5 text-[#007BFF]" />
          My Collections
        </h3>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="p-1 hover:bg-gray-50 border border-gray-200 text-[#007BFF] rounded-lg"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Collection name..."
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
          />
          <button
            type="submit"
            className="p-2 bg-[#007BFF] text-white hover:bg-blue-600 rounded-xl"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="p-2 bg-gray-50 hover:bg-gray-150 border border-gray-200 text-gray-400 rounded-xl"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      <div className="space-y-1.5 text-xs font-semibold text-gray-700">
        {/* All saved default selection */}
        <button
          onClick={() => setSelectedCol("All Saved")}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-colors",
            selectedCol === "All Saved"
              ? "bg-[#007BFF]/5 text-[#007BFF] border-[#007BFF]/35"
              : "bg-white border-transparent hover:bg-gray-50 text-gray-650"
          )}
        >
          <span>All Saved Products</span>
        </button>

        {collections.map((col) => (
          <div
            key={col}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-colors group",
              selectedCol === col
                ? "bg-[#007BFF]/5 text-[#007BFF] border-[#007BFF]/35"
                : "bg-white border-transparent hover:bg-gray-50 text-gray-650"
            )}
          >
            <button onClick={() => setSelectedCol(col)} className="flex-1 text-left">
              {col}
            </button>

            <button
              onClick={() => removeCollection(col)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
