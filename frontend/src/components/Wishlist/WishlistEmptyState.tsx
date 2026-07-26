"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function WishlistEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4 max-w-2xl mx-auto my-8 select-none"
    >
      <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-3xl flex items-center justify-center">
        <Heart className="w-10 h-10 text-rose-500 fill-rose-100" />
      </div>
      
      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-lg font-black text-gray-900">
          Your Wishlist is Empty
        </h3>
        <p className="text-xs text-gray-400 font-medium leading-relaxed">
          Save items you love to your personal wishlist so you can quickly find them later and add them to your cart.
        </p>
      </div>

      <Link
        href="/products"
        className="inline-flex items-center gap-2 py-3 px-6 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/15 transition-all duration-150"
      >
        <ShoppingBag className="w-4 h-4" />
        <span>Explore Products</span>
      </Link>
    </motion.div>
  );
}
