"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutGrid, Heart, ShoppingBag, User, X, ChevronRight, Laptop, Shirt, Gamepad2, Sparkles, Dumbbell } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const categoryOptions = [
  { name: "All Products", icon: LayoutGrid, href: "/products", desc: "Browse entire product catalog" },
  { name: "Electronics", icon: Laptop, href: "/products?category=Electronics", desc: "Gadgets, Laptops & Audio" },
  { name: "Fashion", icon: Shirt, href: "/products?category=Fashion", desc: "Apparel, Shoes & Accessories" },
  { name: "Home & Living", icon: Home, href: "/products?category=Home%20%26%20Living", desc: "Decor, Furniture & Kitchen" },
  { name: "Gaming", icon: Gamepad2, href: "/products?category=Gaming", desc: "Consoles, Gear & Setup" },
  { name: "Beauty", icon: Sparkles, href: "/products?category=Beauty", desc: "Skincare, Makeup & Fragrance" },
  { name: "Sports", icon: Dumbbell, href: "/products?category=Sports", desc: "Fitness, Outdoor & Athletics" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [catSheetOpen, setCatSheetOpen] = useState(false);

  const setCartDrawerOpen = useCartStore((s) => s.setCartDrawerOpen);
  const totalCartItems = useCartStore((s) => s.totalItems)();
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-100 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] px-1 sm:px-2 flex items-center justify-around md:hidden shadow-2xl select-none">
        {/* 1. Home */}
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-1.5 min-[380px]:px-3 rounded-xl transition-colors",
            pathname === "/" ? "text-[#007BFF]" : "text-gray-400 hover:text-gray-700"
          )}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </Link>

        {/* 2. Categories Options */}
        <button
          onClick={() => setCatSheetOpen(true)}
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-1.5 min-[380px]:px-3 rounded-xl transition-colors",
            pathname.includes("/products") && !pathname.includes("/account") ? "text-[#007BFF]" : "text-gray-400 hover:text-gray-700"
          )}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-bold">Categories</span>
        </button>

        {/* 3. Wishlist */}
        <Link
          href="/wishlist"
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-1.5 min-[380px]:px-3 rounded-xl relative transition-colors",
            pathname === "/wishlist" ? "text-[#007BFF]" : "text-gray-400 hover:text-gray-700"
          )}
        >
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] font-bold">Wishlist</span>
        </Link>

        {/* 4. Cart */}
        <button
          onClick={() => setCartDrawerOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-1.5 min-[380px]:px-3 text-gray-400 hover:text-gray-700 relative transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalCartItems > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 bg-[#007BFF] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {totalCartItems}
            </span>
          )}
          <span className="text-[10px] font-bold">Cart</span>
        </button>

        {/* 5. Account */}
        <Link
          href="/account"
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-1.5 min-[380px]:px-3 rounded-xl transition-colors",
            pathname === "/account" || pathname === "/profile" ? "text-[#007BFF]" : "text-gray-400 hover:text-gray-700"
          )}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Account</span>
        </Link>
      </div>

      {/* Category Options Bottom Sheet Modal */}
      <AnimatePresence>
        {catSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCatSheetOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 space-y-4 md:hidden shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-gray-900">Explore Categories</h3>
                  <p className="text-xs text-gray-400 font-medium">Select a category to filter products</p>
                </div>
                <button
                  onClick={() => setCatSheetOpen(false)}
                  className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {categoryOptions.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setCatSheetOpen(false);
                        router.push(cat.href);
                      }}
                      className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-2xl transition-all text-left group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#007BFF] shadow-sm">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900 group-hover:text-[#007BFF] transition-colors">
                            {cat.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">{cat.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#007BFF] transition-colors" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
