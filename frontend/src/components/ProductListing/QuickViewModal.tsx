"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart, Check, Plus, Minus } from "lucide-react";
import { Product } from "@/types";
import { RatingStars } from "@/components/shared/RatingStars";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice } from "@/lib/utils";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState("Default");
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: `${product.name} (${selectedColor})`,
      price: product.price,
      quantity,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1500);
  };

  const colors = ["Titanium", "Slate Blue", "Sunset Orange", "Stellar Black"].slice(
    0,
    product.category.toLowerCase() === "electronics" ? 3 : 1
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-3xl w-full max-h-[90vh] overflow-y-auto z-10 grid grid-cols-1 md:grid-cols-2"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 border border-gray-100 flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Image Container */}
          <div className="relative bg-[#F5F7FA] aspect-square flex items-center justify-center p-6">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[300px] max-w-full object-contain rounded-2xl drop-shadow-md"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-xl">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-[#007BFF] uppercase tracking-widest">{product.brand}</p>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-1 leading-snug">{product.name}</h3>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <RatingStars rating={product.rating} />
                <span className="text-xs text-gray-500 font-medium">({product.reviewCount.toLocaleString()} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl font-black text-[#111827]">{formatPrice(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through font-medium">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>

              {/* Variant color options */}
              {colors.length > 1 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Select Color</p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                          selectedColor === color
                            ? "bg-[#111827] border-[#111827] text-white"
                            : "bg-white border-gray-200 text-gray-700 hover:border-[#007BFF]"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Quantity</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-gray-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-gray-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {product.inStock ? "🟢 In Stock" : "🔴 Out of Stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || added}
                className={`flex-1 py-3.5 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-lg ${
                  added
                    ? "bg-green-500 text-white shadow-green-500/20"
                    : "bg-[#007BFF] hover:bg-blue-600 text-white shadow-blue-500/20 hover:-translate-y-0.5"
                } disabled:opacity-50`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={() => toggleItem(product.id)}
                className={`w-12 rounded-xl border flex items-center justify-center transition-all ${
                  wishlisted
                    ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20"
                    : "border-gray-200 text-gray-700 hover:border-rose-500 hover:text-rose-500"
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
