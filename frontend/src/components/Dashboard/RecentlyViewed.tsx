"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { ShoppingBag, Trash2, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function RecentlyViewed() {
  const [items, setItems] = useState<Product[]>([]);
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useCartStore((s) => s.setCartDrawerOpen);

  useEffect(() => {
    const saved = localStorage.getItem("nati-recently-viewed");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If stored as objects or IDs
          if (typeof parsed[0] === "object") {
            setItems(parsed.slice(0, 4));
          } else {
            // IDs list — fetch products
            fetch(`/api/products?ids=${parsed.slice(0, 4).join(",")}`)
              .then((res) => res.json())
              .then((data) => {
                if (data.products && Array.isArray(data.products)) {
                  setItems(data.products);
                }
              })
              .catch(() => {});
          }
        }
      } catch {
        setItems([]);
      }
    }
  }, []);

  const handleRemove = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);

    const saved = localStorage.getItem("nati-recently-viewed");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const filtered = parsed.filter((i: any) => (typeof i === "string" ? i !== id : i.id !== id));
        localStorage.setItem("nati-recently-viewed", JSON.stringify(filtered));
      } catch {
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

  return (
    <div className="p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-xs space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Eye className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
          Recently Viewed
        </h3>
        {items.length > 0 && (
          <span className="text-[10px] text-slate-400 font-bold">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-8 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl text-center space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">No recently viewed items.</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">Products you inspect will show here.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0 group"
            >
              {/* Image */}
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain p-0.5"
                />
              </div>

              {/* Title / Price */}
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-black text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Link href={`/products/${product.id}`}>{product.name}</Link>
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5 tabular-nums">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Quick actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  title="Add to cart"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRemove(product.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Remove from history"
                  aria-label={`Remove ${product.name} from history`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
