"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { fetchRelatedProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductListing/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductListing/ProductSkeleton";

interface RelatedProductsProps {
  productId: string;
  onQuickView: (product: Product) => void;
}

export default function RelatedProducts({ productId, onQuickView }: RelatedProductsProps) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetchRelatedProducts(productId);
      setItems(res);
      setLoading(false);
    }
    load();
  }, [productId]);

  if (loading) {
    return <ProductGridSkeleton count={4} />;
  }

  if (items.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="border-b border-gray-50 pb-4">
        <h3 className="text-xl font-black text-gray-900">You May Also Like</h3>
        <p className="text-gray-400 text-xs mt-1">Recommended products based on this category</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {items.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            index={idx}
            viewMode="grid"
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </section>
  );
}
