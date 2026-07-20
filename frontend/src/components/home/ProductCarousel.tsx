"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  label?: string;
  products: Product[];
  viewAllHref?: string;
  dark?: boolean;
}

export function ProductCarousel({
  title,
  subtitle,
  label,
  products,
  viewAllHref = "/products",
  dark = false,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = dir === "right" ? 320 : -320;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className={`py-16 ${dark ? "bg-[#F5F7FA]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            {label && (
              <p className="text-[#007BFF] text-sm font-semibold uppercase tracking-widest mb-1">{label}</p>
            )}
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827]">{title}</h2>
            {subtitle && <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <a href={viewAllHref} className="hidden sm:flex items-center gap-1 text-[#007BFF] font-semibold text-sm hover:gap-2 transition-all mr-4">
              View All <span>→</span>
            </a>
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:border-[#007BFF] hover:text-[#007BFF] flex items-center justify-center transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:border-[#007BFF] hover:text-[#007BFF] flex items-center justify-center transition-colors shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product, i) => (
            <div key={product.id} className="shrink-0 w-[240px] sm:w-[260px]">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
