"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Award, ShieldCheck } from "lucide-react";

interface BrandItem {
  name: string;
  category: string;
  count: number;
  badge?: string;
  logoText: string;
  gradient: string;
}

const FEATURED_BRANDS: BrandItem[] = [
  { name: "Apple", category: "Electronics", count: 18, badge: "Premium", logoText: "", gradient: "from-[#111827] to-[#374151]" },
  { name: "Sony", category: "Audio & Gaming", count: 24, badge: "Popular", logoText: "SONY", gradient: "from-blue-600 to-indigo-800" },
  { name: "Nike", category: "Fashion & Sports", count: 42, badge: "Best Seller", logoText: "NIKE", gradient: "from-orange-500 to-rose-600" },
  { name: "Samsung", category: "Electronics & TV", count: 31, badge: "Official", logoText: "SAMSUNG", gradient: "from-blue-700 to-cyan-600" },
  { name: "Levi's", category: "Denim & Apparel", count: 19, badge: "Classic", logoText: "LEVI'S", gradient: "from-red-600 to-amber-700" },
  { name: "Dyson", category: "Home & Beauty", count: 14, badge: "Innovation", logoText: "dyson", gradient: "from-fuchsia-600 to-purple-800" },
  { name: "Ray-Ban", category: "Eyewear", count: 16, badge: "Trending", logoText: "Ray-Ban", gradient: "from-amber-600 to-red-700" },
  { name: "Adidas", category: "Footwear & Sport", count: 38, badge: "Official", logoText: "adidas", gradient: "from-emerald-600 to-teal-800" },
  { name: "The North Face", category: "Outerwear", count: 12, badge: "Outdoor", logoText: "TNF", gradient: "from-slate-700 to-slate-900" },
  { name: "Nespresso", category: "Coffee & Kitchen", count: 15, badge: "Lifestyle", logoText: "NESPRESSO", gradient: "from-stone-600 to-stone-800" },
  { name: "Razer", category: "Gaming Gear", count: 22, badge: "Pro Gaming", logoText: "RAZER", gradient: "from-green-500 to-emerald-800" },
  { name: "Gucci", category: "Luxury Fashion", count: 9, badge: "Luxury", logoText: "GUCCI", gradient: "from-yellow-600 to-amber-900" },
];

export function BrandSection() {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-gray-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-end justify-between mb-8 gap-4"
        >
          <div>
            <div className="flex items-center gap-1.5 text-[#007BFF] text-xs font-bold uppercase tracking-widest mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Official Partners</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">
              Explore Top Brands
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
              Authentic products guaranteed directly from global leaders
            </p>
          </div>

          <Link
            href="/products"
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#007BFF] hover:gap-2 transition-all"
          >
            <span>All Brands</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Brands Horizontal Touch Scroll on Mobile / Grid on Desktop */}
        <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
          {FEATURED_BRANDS.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="shrink-0 w-[150px] min-[400px]:w-[170px] sm:w-auto snap-start"
            >
              <Link
                href={`/products?brand=${encodeURIComponent(brand.name)}`}
                className="group flex flex-col justify-between p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#007BFF]/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 h-full relative overflow-hidden"
              >
                {/* Brand Badge */}
                {brand.badge && (
                  <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 group-hover:bg-[#007BFF] group-hover:text-white transition-colors self-start mb-3">
                    {brand.badge}
                  </span>
                )}

                {/* Brand Logo Banner */}
                <div className={`w-full h-12 rounded-xl bg-gradient-to-br ${brand.gradient} flex items-center justify-center text-white font-black text-sm tracking-wider shadow-inner group-hover:scale-105 transition-transform duration-300`}>
                  {brand.logoText}
                </div>

                {/* Brand Info */}
                <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-gray-900 truncate group-hover:text-[#007BFF] transition-colors">
                      {brand.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium truncate">
                      {brand.count} items
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#007BFF] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Brand guarantee banner */}
        <div className="mt-8 p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#007BFF] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">100% Genuine Brand Assurance</p>
              <p className="text-[11px] text-gray-400">All products are sourced directly from authorized brand distributors</p>
            </div>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-[#007BFF] hover:underline shrink-0"
          >
            Shop Verified Brands →
          </Link>
        </div>

      </div>
    </section>
  );
}
