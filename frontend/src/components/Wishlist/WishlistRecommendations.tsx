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
        setProducts(res.products || []);
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
      <div className="py-8 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 w-48 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-8 border-t border-gray-200/80 space-y-6">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-[#007BFF]" />
        <h3 className="text-lg font-black text-gray-900">
          Recommended For You
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            <ProductCard product={product} index={index} viewMode="grid" onQuickView={() => {}} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
