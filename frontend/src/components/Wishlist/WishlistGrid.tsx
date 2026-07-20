"use client";

import { useWishlistStore } from "@/store/wishlist";
import WishlistProductCard from "./WishlistProductCard";
import { motion, Variants } from "framer-motion";
import { useMemo } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function WishlistGrid() {
  const { items, filters, sort } = useWishlistStore();

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Filter by search query
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(q));
    }

    // Filter by category
    if (filters.category !== "all" && filters.category !== "") {
      result = result.filter((item) => item.category === filters.category);
    }

    // Sort items
    result.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "date-added":
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [items, filters, sort]);

  if (filteredAndSortedItems.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 dark:text-gray-400">
        No items found matching your criteria.
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {filteredAndSortedItems.map((item) => (
        <motion.div key={item.id} variants={itemVariants} layout>
          <WishlistProductCard product={item} onQuickView={() => {}} />
        </motion.div>
      ))}
    </motion.div>
  );
}
