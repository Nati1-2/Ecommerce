"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { mockProducts } from "@/data/mock";
import { useCartStore } from "@/store/cart";
import { ShoppingBag, Trash2, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function RecentlyViewed() {
  const [items, setItems] = useState<Product[]>([]);
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useCartStore((s) => s.setCartDrawerOpen);

  useEffect(() => {
    // Load local storage items
    const saved = localStorage.getItem("aura-recently-viewed");
    if (saved) {
      try {
        const ids: string[] = JSON.parse(saved);
        const resolved = mockProducts.filter((p) => ids.includes(p.id));
        setItems(resolved.slice(0, 4));
      } catch (err) {
        // ignore
      }
    } else {
      // Default fallback
      setItems(mockProducts.slice(1, 4));
    }
  }, []);

  const handleRemove = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);

    const saved = localStorage.getItem("aura-recently-viewed");
    if (saved) {
      try {
        const ids: string[] = JSON.parse(saved);
        const filtered = ids.filter((i) => i !== id);
        localStorage.setItem("aura-recently-viewed", JSON.stringify(filtered));
      } catch (err) {
        // ignore
      }
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    setCartDrawerOpen(true);
  };

  if (items.length === 0) {
    return (
      <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
        <h3 className="text-sm font-black text-gray-900">Recently Viewed</h3>
        <div className="py-8 bg-gray-50 border border-gray-100 rounded-2xl text-center">
          <p className="text-xs text-gray-400 font-bold">No recently viewed items.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <h3 className="text-sm font-black text-gray-900">Recently Viewed</h3>

      <div className="divide-y divide-gray-100">
        {items.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0 group"
          >
            {/* Image */}
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain p-0.5"
              />
            </div>

            {/* Title / Price */}
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-black text-gray-900 truncate group-hover:text-[#007BFF] transition-colors">
                <Link href={`/products/${product.id}`}>{product.name}</Link>
              </h4>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="p-1.5 rounded-lg bg-blue-50 hover:bg-[#007BFF] text-[#007BFF] hover:text-white transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleRemove(product.id)}
                className="p-1.5 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
