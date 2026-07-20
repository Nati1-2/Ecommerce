"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { mockProducts } from "@/data/mock";
import { ProductCard } from "@/components/ProductListing/ProductCard";

interface RecentlyViewedProps {
  currentProductId: string;
  onQuickView: (product: Product) => void;
}

export default function RecentlyViewed({ currentProductId, onQuickView }: RecentlyViewedProps) {
  const [list, setList] = useState<Product[]>([]);

  useEffect(() => {
    // 1. Get existing viewed product IDs from localStorage
    const saved = localStorage.getItem("aura-recently-viewed");
    let viewedIds: string[] = saved ? JSON.parse(saved) : [];

    // Filter viewed IDs to make sure they correspond to active items
    let viewedProducts = viewedIds
      .map((id) => mockProducts.find((p) => p.id === id))
      .filter((p): p is Product => !!p && p.id !== currentProductId);

    setList(viewedProducts.slice(0, 4));

    // 2. Add current product to the top of viewed history
    const nextIds = [currentProductId, ...viewedIds.filter((id) => id !== currentProductId)].slice(0, 5);
    localStorage.setItem("aura-recently-viewed", JSON.stringify(nextIds));
  }, [currentProductId]);

  if (list.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="border-b border-gray-50 pb-4">
        <h3 className="text-xl font-black text-gray-900">Recently Viewed</h3>
        <p className="text-gray-400 text-xs mt-1">Your recent browsing history</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {list.map((product, idx) => (
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
