"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductListing/ProductCard";
import { Sparkles } from "lucide-react";

export default function WishlistRecommendations() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const res = await fetchProducts({ limit: 4, sort: "popular" });
        setProducts(res.products);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="py-12 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 w-64 mb-6 rounded-md"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="flex items-center space-x-2 mb-8">
        <Sparkles className="w-6 h-6 text-primary-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Inspired by your Wishlist
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} index={index} viewMode="grid" onQuickView={() => {}} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
