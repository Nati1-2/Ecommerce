"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <Heart className="w-12 h-12 text-gray-400 dark:text-gray-500" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Your wishlist is empty
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
        Save items you love to your wishlist. Review them anytime and easily move them to your cart.
      </p>

      <Link
        href="/products"
        className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors duration-200"
      >
        Explore Products
      </Link>
    </motion.div>
  );
}
