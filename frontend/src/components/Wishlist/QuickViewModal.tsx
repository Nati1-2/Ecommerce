"use client";

import { WishlistItem } from "@/store/wishlist";
import { X, Star, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { motion, AnimatePresence } from "framer-motion";

interface QuickViewModalProps {
  product: WishlistItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useCartStore((s) => s.setCartDrawerOpen);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem({
      productId: product.productId,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    setCartDrawerOpen(true);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          />

          {/* Modal overlay */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 z-[60] shadow-2xl space-y-4 select-none"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Quick View</span>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-50 text-gray-400 hover:text-gray-900 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-4">
              {/* Image */}
              <div className="w-28 h-28 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-[85%] max-h-[85%] object-contain"
                />
              </div>

              {/* info details */}
              <div className="flex-1 min-w-0 space-y-2 text-left text-xs font-semibold">
                <span className="text-[9px] font-black text-[#007BFF] uppercase tracking-wider block">
                  {product.brand}
                </span>
                <h4 className="text-sm font-black text-gray-900 leading-snug">
                  {product.name}
                </h4>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-gray-500 font-bold">
                    {product.rating} ({product.reviewsCount} reviews)
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-black text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <p className="text-[10px] text-gray-400 font-semibold text-left leading-relaxed">
                Experience premium engineering with full design integration, battery optimization, and professional security frameworks.
              </p>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-3.5 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Shopping Cart
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
