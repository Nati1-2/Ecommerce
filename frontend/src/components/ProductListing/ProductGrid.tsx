"use client";

import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  viewMode: "grid" | "list";
  onQuickView: (product: Product) => void;
}

export function ProductGrid({ products, viewMode, onQuickView }: ProductGridProps) {
  return (
    <div
      className={cn(
        viewMode === "grid"
          ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
          : "flex flex-col gap-4"
      )}
    >
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          index={i}
          viewMode={viewMode}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}
