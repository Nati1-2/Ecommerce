"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Award, ShieldCheck } from "lucide-react";

interface BrandItem {
  id: string;
  name: string;
  category: string;
  count: number;
  badge?: string;
  gradient: string;
}

const FEATURED_BRANDS: BrandItem[] = [
  { id: "apple", name: "Apple", category: "Electronics", count: 18, badge: "Premium", gradient: "from-[#111827] to-[#1F2937]" },
  { id: "sony", name: "Sony", category: "Audio & Gaming", count: 24, badge: "Popular", gradient: "from-blue-700 to-indigo-900" },
  { id: "nike", name: "Nike", category: "Fashion & Sports", count: 42, badge: "Best Seller", gradient: "from-orange-600 to-rose-700" },
  { id: "samsung", name: "Samsung", category: "Electronics & TV", count: 31, badge: "Official", gradient: "from-blue-600 to-cyan-800" },
  { id: "levis", name: "Levi's", category: "Denim & Apparel", count: 19, badge: "Classic", gradient: "from-red-700 to-amber-800" },
  { id: "dyson", name: "Dyson", category: "Home & Beauty", count: 14, badge: "Innovation", gradient: "from-fuchsia-700 to-purple-900" },
  { id: "rayban", name: "Ray-Ban", category: "Eyewear", count: 16, badge: "Trending", gradient: "from-amber-700 to-red-800" },
  { id: "adidas", name: "Adidas", category: "Footwear & Sport", count: 38, badge: "Official", gradient: "from-emerald-700 to-teal-900" },
  { id: "tnf", name: "The North Face", category: "Outerwear", count: 12, badge: "Outdoor", gradient: "from-slate-800 to-gray-950" },
  { id: "nespresso", name: "Nespresso", category: "Coffee & Kitchen", count: 15, badge: "Lifestyle", gradient: "from-stone-700 to-neutral-900" },
  { id: "razer", name: "Razer", category: "Gaming Gear", count: 22, badge: "Pro Gaming", gradient: "from-emerald-600 to-green-900" },
  { id: "gucci", name: "Gucci", category: "Luxury Fashion", count: 9, badge: "Luxury", gradient: "from-amber-800 to-yellow-950" },
];

function RenderBrandLogo({ id }: { id: string }) {
  switch (id) {
    case "apple":
      return (
        <svg className="h-6 w-6 text-white fill-current" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.97.99-3.12-1 .04-2.18.67-2.88 1.49-.6.7-1.12 1.83-.97 2.96 1.11.09 2.22-.53 2.86-1.33z" />
        </svg>
      );

    case "nike":
      return (
        <svg className="h-6 w-16 text-white fill-current" viewBox="0 0 24 24">
          <path d="M21.707 5.293c-.276-.276-.757-.225-1.06.115-3.693 4.15-8.814 6.782-14.28 6.782-1.734 0-3.328-.278-4.757-.792-.472-.17-.923.277-.665.702 2.056 3.395 5.922 5.4 10.155 5.4 6.643 0 12.012-4.66 12.986-10.74.058-.363-.103-.761-.379-1.067z" />
        </svg>
      );

    case "sony":
      return (
        <span className="text-white font-black text-lg tracking-[0.25em] uppercase font-serif">
          SONY
        </span>
      );

    case "samsung":
      return (
        <div className="border border-white/80 rounded-full px-3 py-1 text-white font-black text-xs tracking-wider uppercase font-sans">
          SAMSUNG
        </div>
      );

    case "levis":
      return (
        <div className="flex items-center gap-1">
          <span className="bg-red-600 text-white font-black text-[9px] px-1 py-0.5 rounded uppercase tracking-tighter">
            RED TAB
          </span>
          <span className="text-white font-black text-base italic tracking-tight font-serif">
            Levi&apos;s
          </span>
        </div>
      );

    case "dyson":
      return (
        <span className="text-white font-bold text-lg tracking-normal font-sans lowercase">
          dyson
        </span>
      );

    case "rayban":
      return (
        <span className="text-white font-black text-base italic tracking-wide font-serif">
          Ray-Ban
        </span>
      );

    case "adidas":
      return (
        <div className="flex flex-col items-center justify-center">
          <svg className="h-5 w-7 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12 2L4 16h3.5l4.5-8 4.5 8H20L12 2zm-7 15h14v2H5v-2z" />
          </svg>
          <span className="text-[10px] text-white font-black tracking-widest uppercase -mt-0.5">
            adidas
          </span>
        </div>
      );

    case "tnf":
      return (
        <div className="flex items-center gap-1.5">
          <svg className="h-5 w-5 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-4h2v4zm0-6h-2V8h2v2z" />
          </svg>
          <span className="text-white font-black text-xs tracking-tight uppercase">
            THE NORTH FACE
          </span>
        </div>
      );

    case "nespresso":
      return (
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white font-black text-[10px]">
            N
          </span>
          <span className="text-white font-black text-xs tracking-widest uppercase">
            NESPRESSO
          </span>
        </div>
      );

    case "razer":
      return (
        <div className="flex items-center gap-1">
          <svg className="h-5 w-5 text-emerald-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 9L2 6v11l10 5 10-5V6l-10 5z" />
          </svg>
          <span className="text-white font-black text-xs tracking-widest uppercase">
            R A Z E R
          </span>
        </div>
      );

    case "gucci":
      return (
        <div className="flex items-center gap-1.5">
          <span className="text-amber-200 font-serif font-black text-base tracking-tighter">
            GG
          </span>
          <span className="text-white font-serif font-black text-xs tracking-widest uppercase">
            GUCCI
          </span>
        </div>
      );

    default:
      return (
        <span className="text-white font-black text-sm tracking-wider uppercase">
          {id}
        </span>
      );
  }
}

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
              <span>Official Brands</span>
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
                className="group flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#007BFF]/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 h-full relative overflow-hidden"
              >
                {/* Brand Badge */}
                {brand.badge && (
                  <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 group-hover:bg-[#007BFF] group-hover:text-white transition-colors self-start mb-3">
                    {brand.badge}
                  </span>
                )}

                {/* 100% Guaranteed Crisp Inline Brand Logo */}
                <div
                  className={`w-full h-14 rounded-xl bg-gradient-to-br ${brand.gradient} flex items-center justify-center p-3 shadow-inner group-hover:scale-[1.03] transition-transform duration-300 relative overflow-hidden`}
                >
                  <RenderBrandLogo id={brand.id} />
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
