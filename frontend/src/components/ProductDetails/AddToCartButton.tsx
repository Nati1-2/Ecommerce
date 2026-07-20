"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  onAdd: () => void;
  inStock: boolean;
}

export default function AddToCartButton({ onAdd, inStock }: AddToCartButtonProps) {
  const [success, setSuccess] = useState(false);

  const handleAdd = () => {
    onAdd();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={!inStock || success}
      className={cn(
        "flex-1 py-4 px-6 rounded-2xl font-bold transition-all text-sm flex items-center justify-center gap-2.5 shadow-lg",
        success
          ? "bg-green-500 text-white shadow-green-500/25"
          : "bg-[#007BFF] hover:bg-blue-600 text-white shadow-blue-500/20 hover:-translate-y-0.5"
      )}
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.span
            key="success"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2"
          >
            <Check className="w-4.5 h-4.5" />
            Added to Cart!
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            Add to Cart
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
