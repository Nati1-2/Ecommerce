"use client";

import { useRef } from "react";
import Link from "next/link";
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
    <section className={`py-12 sm:py-16 ${dark ? "bg-[#F5F7FA]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-end justify-between mb-6 sm:mb-8 gap-4"
        >
          <div>
            {label && (
              <p className="text-[#007BFF] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1">{label}</p>
            )}
            <h2 className="text-2xl sm:text-4xl font-black text-[#111827]">{title}</h2>
            {subtitle && <p className="text-gray-500 mt-1 text-xs sm:text-sm">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            <Link href={viewAllHref} className="flex items-center gap-1 text-[#007BFF] font-semibold text-xs sm:text-sm hover:gap-2 transition-all mr-2 sm:mr-4">
              View All <span>→</span>
            </Link>
            <button
              onClick={() => scroll("left")}
              aria-label="Previous products"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 bg-white hover:border-[#007BFF] hover:text-[#007BFF] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next products"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 bg-white hover:border-[#007BFF] hover:text-[#007BFF] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory flex-nowrap"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product, i) => (
            <div key={product.id} className="shrink-0 w-[225px] min-[400px]:w-[250px] sm:w-[270px] snap-start h-auto flex flex-col">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
