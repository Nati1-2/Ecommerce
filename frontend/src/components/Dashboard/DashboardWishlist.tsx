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
        } else {
          // Fallback to Zustand store items or demo items
          if (localItems.length > 0) {
            setItems(localItems);
          } else {
            setItems([
              {
                id: "prod-demo-1",
                name: "Apex Smart Watch Ultra",
                price: 249.99,
                originalPrice: 299.99,
                image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80",
                category: "Electronics",
                rating: 4.9,
                inStock: true,
              },
              {
                id: "prod-demo-2",
                name: "Sonic Bass Pro Wireless Headphones",
                price: 159.99,
                originalPrice: 189.99,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
                category: "Electronics",
                rating: 4.8,
                inStock: true,
              },
            ]);
          }
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
      <div className="p-8 border border-gray-100 bg-white rounded-3xl animate-pulse space-y-4">
        <div className="h-6 w-40 bg-gray-100 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-50 rounded-2xl"></div>
          <div className="h-32 bg-gray-50 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-100 bg-white rounded-3xl shadow-sm space-y-6 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900">Saved Wishlist</h2>
            <p className="text-[11px] text-gray-400 font-semibold">
              {items.length} {items.length === 1 ? "item" : "items"} saved in your account database
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-12 text-center space-y-4">
          <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto text-gray-300">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900">Your wishlist is empty</h3>
            <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto mt-1">
              Explore products and save items you love for later.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 py-3 px-5 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/15 transition-all"
          >
            Explore Catalog
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
                className="p-4 border border-gray-100 hover:border-gray-200 bg-[#F5F7FA]/40 hover:bg-white rounded-2xl flex gap-4 items-center transition-all group shadow-sm"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-gray-100 shrink-0">
                  <Image
                    src={item.image || "/iphone17.png"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black uppercase text-[#007BFF] bg-blue-50 px-2 py-0.5 rounded-md">
                    {item.category || "Item"}
                  </span>
                  <h4 className="text-xs font-black text-gray-900 truncate mt-1">{item.name}</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xs font-black text-gray-900">{formatPrice(item.price)}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-[10px] text-gray-400 line-through font-semibold">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`py-2 px-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                      addedItemIds[item.id]
                        ? "bg-emerald-600 text-white"
                        : "bg-[#007BFF] hover:bg-blue-600 text-white shadow-md shadow-blue-500/10"
                    }`}
                  >
                    {addedItemIds[item.id] ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-center self-end"
                    title="Remove from wishlist"
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
