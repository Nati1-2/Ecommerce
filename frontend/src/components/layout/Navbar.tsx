"use client";

import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import {
  ShoppingBag, Search, Heart, User, Menu, X, ChevronDown,
  Laptop, Shirt, Home, Gamepad2, Sparkles, Dumbbell, LogIn, Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/Search/SearchBar";

const categories = [
  { name: "Electronics", icon: Laptop, href: "/category/electronics" },
  { name: "Fashion", icon: Shirt, href: "/category/fashion" },
  { name: "Home & Living", icon: Home, href: "/category/home" },
  { name: "Gaming", icon: Gamepad2, href: "/category/gaming" },
  { name: "Beauty", icon: Sparkles, href: "/category/beauty" },
  { name: "Sports", icon: Dumbbell, href: "/category/sports" },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const cartDrawerOpen = useCartStore((s) => s.cartDrawerOpen);
  const setCartDrawerOpen = useCartStore((s) => s.setCartDrawerOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const cartItems = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.totalItems)();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const router = useRouter();

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
            : "bg-white border-b border-gray-100"
        )}
      >
        {/* Top bar */}
        <div className="bg-[#111827] text-white text-xs py-2 text-center hidden md:block">
          <span>🚚 Free shipping on orders over $50 &nbsp;|&nbsp; Use code </span>
          <span className="font-bold text-[#5AA8FF]">AURA10</span>
          <span> for 10% off your first order</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Logo + Categories */}
          <div className="flex items-center gap-6">
            <button
              className="md:hidden p-2 -ml-2 text-gray-700 hover:text-[#007BFF] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-1 shrink-0">
              <span className="text-2xl font-black tracking-tight text-[#111827]">
                Aura<span className="text-[#007BFF]">.</span>
              </span>
            </Link>

            {/* Categories dropdown */}
            <div className="hidden md:block relative" onMouseLeave={() => setCatOpen(false)}>
              <button
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#007BFF] transition-colors py-1"
                onMouseEnter={() => setCatOpen(true)}
                onClick={() => setCatOpen(!catOpen)}
              >
                <span>Categories</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", catOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#007BFF] transition-colors"
                        onClick={() => setCatOpen(false)}
                      >
                        <cat.icon className="w-4 h-4" />
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <Suspense fallback={<div className="w-full h-[48px] rounded-full bg-gray-100 animate-pulse" />}>
              <SearchBar />
            </Suspense>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            {/* Mobile search */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-[#007BFF] transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="hidden md:flex p-2 text-gray-700 hover:text-[#007BFF] transition-colors rounded-full hover:bg-blue-50 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 text-gray-700 hover:text-[#007BFF] transition-colors rounded-full hover:bg-blue-50">
              <Heart className="w-5 h-5" />
              {mounted && wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 text-gray-700 hover:text-[#007BFF] transition-colors rounded-full hover:bg-blue-50"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#007BFF] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Account */}
            <Link
              href="/account"
              className="hidden md:flex items-center gap-2 ml-1 pl-3 border-l border-gray-200 text-sm font-medium text-gray-700 hover:text-[#007BFF] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#007BFF] to-[#5AA8FF] flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden lg:block">Account</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
            >
              <div className="px-4 py-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <span className="text-xl font-black text-[#111827]">
                  Aura<span className="text-[#007BFF]">.</span>
                </span>
                <button onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Categories</p>
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-[#007BFF] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <cat.icon className="w-5 h-5" />
                    <span className="font-medium">{cat.name}</span>
                  </Link>
                ))}

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                  <Link href="/account" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-blue-50" onClick={() => setMobileOpen(false)}>
                    <User className="w-5 h-5" />
                    <span className="font-medium">My Account</span>
                  </Link>
                  <Link href="/wishlist" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-blue-50" onClick={() => setMobileOpen(false)}>
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">Wishlist</span>
                    {mounted && wishlistCount > 0 && <span className="ml-auto bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full">{wishlistCount}</span>}
                  </Link>
                </div>
              </nav>

              <div className="p-4 border-t border-gray-100">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#007BFF] text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In / Register
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setCartDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  Shopping Cart
                  {mounted && totalItems > 0 && (
                    <span className="ml-2 bg-[#007BFF] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </h2>
                <button onClick={() => setCartDrawerOpen(false)}>
                  <X className="w-5 h-5 text-gray-500 hover:text-gray-900" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {!mounted || cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-200" />
                    <p className="text-gray-500 font-medium">Your cart is empty</p>
                    <button
                      onClick={() => setCartDrawerOpen(false)}
                      className="text-[#007BFF] text-sm font-semibold hover:underline"
                    >
                      Continue Shopping →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-[#007BFF] font-bold mt-0.5">${item.price}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {mounted && cartItems.length > 0 && (
                <div className="p-4 border-t border-gray-100 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold text-gray-900">
                      ${useCartStore.getState().totalPrice().toFixed(2)}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setCartDrawerOpen(false)}
                    className="block w-full py-3.5 bg-[#007BFF] text-white text-center font-bold rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Checkout
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setCartDrawerOpen(false)}
                    className="block w-full py-3 border border-gray-200 text-gray-700 text-center font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
                  >
                    View Cart
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
