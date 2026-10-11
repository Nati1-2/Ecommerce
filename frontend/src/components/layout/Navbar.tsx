"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, Suspense } from "react";
import {
  ShoppingBag, Search, Heart, User, Menu, X, ChevronDown,
  Laptop, Shirt, Home, Gamepad2, Sparkles, Dumbbell, LogIn, LogOut, Bell, LayoutGrid, LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/Search/SearchBar";
import NavbarNotifications from "@/components/layout/NavbarNotifications";
import { useNotificationStore } from "@/store/notificationStore";
import { useAuthStore } from "@/store/auth";

const categories = [
  { name: "All Products", icon: LayoutGrid, href: "/products" },
  { name: "Electronics", icon: Laptop, href: "/products?category=Electronics" },
  { name: "Fashion", icon: Shirt, href: "/products?category=Fashion" },
  { name: "Home & Living", icon: Home, href: "/products?category=Home%20%26%20Living" },
  { name: "Gaming", icon: Gamepad2, href: "/products?category=Gaming" },
  { name: "Beauty", icon: Sparkles, href: "/products?category=Beauty" },
  { name: "Sports", icon: Dumbbell, href: "/products?category=Sports" },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const cartDrawerOpen = useCartStore((s) => s.cartDrawerOpen);
  const setCartDrawerOpen = useCartStore((s) => s.setCartDrawerOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  const cartItems = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.totalItems)();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const unreadNotifCount = useNotificationStore((s) => s.unreadCount);
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    useCartStore.getState().initialize();
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Click outside to close categories dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          "fixed top-0 w-full z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border-b border-slate-200/80 dark:border-slate-800"
            : "bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800"
        )}
      >
        {/* Top bar */}
        <div className="bg-[#0F172A] dark:bg-[#060911] text-white text-[10px] sm:text-xs py-1.5 sm:py-2 text-center px-4 flex items-center justify-center flex-wrap gap-x-1.5 border-b border-slate-800">
          <span>🚚 Free shipping on orders $50+ &nbsp;|&nbsp; Use code </span>
          <span className="font-extrabold text-[#5AA8FF]">NATI10</span>
          <span> for 10% off</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6 lg:gap-8">
          {/* Left: Logo + Categories + Quick Links */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <button
              className="md:hidden p-2 -ml-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-1 shrink-0">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Nati<span className="text-blue-600 dark:text-blue-500">.</span>
              </span>
            </Link>

            {/* Categories dropdown (Click-to-Toggle) */}
            <div ref={catRef} className="hidden md:block relative">
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs lg:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                onClick={() => setCatOpen(!catOpen)}
              >
                <span>Categories</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", catOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden py-1 z-50"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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

            {/* Desktop Quick Nav Links - Fills empty left space naturally on large screens */}
            <nav className="hidden xl:flex items-center gap-5 pl-2 text-xs font-bold text-slate-600 dark:text-slate-300">
              <Link href="/products" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Products
              </Link>
              <Link href="/flash-sale" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                <span className="text-amber-500 font-black">⚡</span> Deals
              </Link>
              <Link href="/bestsellers" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Best Sellers
              </Link>
            </nav>
          </div>

          {/* Center: Search Bar (Properly bounded & expanding without gaping voids) */}
          <div className="hidden md:flex flex-1 items-center max-w-2xl lg:max-w-3xl mx-2 lg:mx-4">
            <Suspense fallback={<div className="w-full h-[44px] rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />}>
              <SearchBar />
            </Suspense>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Mobile search */}
            <button
              className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Real Interactive Notifications Popover */}
            <NavbarNotifications
              open={notifOpen}
              onToggle={() => setNotifOpen(!notifOpen)}
              onClose={() => setNotifOpen(false)}
            />

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute 0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-slate-900 shadow-xs"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute 0.5 -right-0.5 min-w-[18px] h-[18px] bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-slate-900 shadow-xs"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Vertical Separator */}
            <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

            {/* Account / Auth */}
            {mounted && isAuthenticated ? (
              <Link
                href={user?.role === "ADMIN" ? "/admin/dashboard" : user?.role === "VENDOR" ? "/vendor/dashboard" : "/dashboard"}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-extrabold shadow-2xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="hidden lg:block truncate max-w-[110px]">{user?.name?.split(" ")[0] || "Dashboard"}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <div className="px-4 py-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
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
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[320px] bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col md:hidden border-r border-slate-200/80 dark:border-slate-800"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  Nati<span className="text-blue-600 dark:text-blue-500">.</span>
                </span>
                <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">Categories</p>
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <cat.icon className="w-5 h-5" />
                    <span className="font-medium">{cat.name}</span>
                  </Link>
                ))}

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <Link href="/notifications" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40" onClick={() => setMobileOpen(false)}>
                    <Bell className="w-5 h-5" />
                    <span className="font-medium">Notifications</span>
                    {mounted && unreadNotifCount > 0 && <span className="ml-auto bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">{unreadNotifCount}</span>}
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40" onClick={() => setMobileOpen(false)}>
                    <LayoutDashboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium">User Dashboard</span>
                  </Link>
                  <Link href="/account" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40" onClick={() => setMobileOpen(false)}>
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profile & Security</span>
                  </Link>
                  <Link href="/wishlist" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40" onClick={() => setMobileOpen(false)}>
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">Wishlist</span>
                    {mounted && wishlistCount > 0 && <span className="ml-auto bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold px-2 py-0.5 rounded-full">{wishlistCount}</span>}
                  </Link>
                </div>
              </nav>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {mounted && isAuthenticated ? (
                  <>
                    <Link
                      href={user?.role === "ADMIN" ? "/admin/dashboard" : user?.role === "VENDOR" ? "/vendor/dashboard" : "/dashboard"}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        useAuthStore.getState().logout();
                        if (typeof window !== "undefined") {
                          localStorage.removeItem("auth_token");
                          window.location.href = "/login";
                        }
                        setMobileOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl font-bold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In / Register
                  </Link>
                )}
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
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
              onClick={() => setCartDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:max-w-[400px] bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col border-l border-slate-200/80 dark:border-slate-800"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Shopping Cart
                  {mounted && totalItems > 0 && (
                    <span className="ml-2 bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </h2>
                <button onClick={() => setCartDrawerOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {!mounted || cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Your cart is empty</p>
                    <button
                      onClick={() => setCartDrawerOpen(false)}
                      className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline cursor-pointer"
                    >
                      Continue Shopping →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl">
                        <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                          <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-extrabold mt-0.5">${item.price}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {mounted && cartItems.length > 0 && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                    <span className="font-black text-slate-900 dark:text-white">
                      ${useCartStore.getState().totalPrice().toFixed(2)}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={(e) => {
                      setCartDrawerOpen(false);
                      if (!isAuthenticated) {
                        e.preventDefault();
                        router.push("/login?redirect=/checkout");
                      }
                    }}
                    className="block w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold rounded-xl transition-colors shadow-xs"
                  >
                    Checkout
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setCartDrawerOpen(false)}
                    className="block w-full py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-center font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
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
