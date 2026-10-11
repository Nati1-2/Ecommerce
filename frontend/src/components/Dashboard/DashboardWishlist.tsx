"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Heart, ShoppingBag, Trash2, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardWishlist() {
  const { items: localItems, removeItem, clearWishlist } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.wishlist) && data.wishlist.length > 0) {
          setItems(data.wishlist);
        } else if (localItems.length > 0) {
          setItems(localItems);
        } else {
          setItems([]);
        }
      })
      .catch(() => {
        setItems(localItems.length > 0 ? localItems : []);
      })
      .finally(() => setLoading(false));
  }, [localItems]);

  const handleRemove = (id: string) => {
    removeItem(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    fetch(`/api/wishlist?id=${id}`, { method: "DELETE" }).catch(() => {});
  };

  const handleClearAll = () => {
    clearWishlist();
    setItems([]);
    fetch("/api/wishlist?id=clear-all", { method: "DELETE" }).catch(() => {});
  };

  const handleAddToCart = (item: any) => {
    addItemToCart({
      productId: item.id || item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="p-8 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl animate-pulse space-y-4">
        <div className="h-6 w-40 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-slate-50 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-32 bg-slate-50 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xs space-y-6 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-center text-rose-500">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">Saved Wishlist</h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
              {items.length} {items.length === 1 ? "item" : "items"} saved in your collection
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-12 text-center space-y-4">
          <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Your wishlist is empty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto mt-1">
              Explore products and save items you love for easy access later.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-4 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl flex gap-4 items-center transition-all group shadow-xs"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shrink-0">
                  <Image
                    src={item.image || "/iphone17.png"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 rounded-md">
                    {item.category || "Item"}
                  </span>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate mt-1">
                    {item.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through font-semibold tabular-nums">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`py-2 px-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      addedItemIds[item.id]
                        ? "bg-emerald-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                    }`}
                  >
                    {addedItemIds[item.id] ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors self-end cursor-pointer"
                    title="Remove from wishlist"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
