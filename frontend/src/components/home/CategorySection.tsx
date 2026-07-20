"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
    >
      <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
        <div className="group relative overflow-hidden rounded-2xl cursor-pointer h-36 sm:h-44 border border-gray-100 hover:border-[#007BFF]/30 hover:shadow-lg transition-all duration-300">
          {/* Background image */}
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <span className="text-xl mb-0.5">{category.icon}</span>
            <h3 className="text-white font-bold text-sm sm:text-base leading-tight">{category.name}</h3>
            <p className="text-white/60 text-xs mt-0.5">{category.productCount.toLocaleString()} products</p>
          </div>

          {/* Arrow */}
          <div className="absolute top-3 right-3 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0">
            <span className="text-white text-xs">→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

interface CategorySectionProps {
  categories: Category[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="py-14 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-7"
        >
          <div>
            <p className="text-[#007BFF] text-xs font-bold uppercase tracking-widest mb-1">Browse by</p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Top Categories</h2>
          </div>
          <Link href="/categories" className="hidden sm:flex items-center gap-1 text-[#007BFF] font-semibold text-sm hover:gap-2 transition-all">
            View All <span>→</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
