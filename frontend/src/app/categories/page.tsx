"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { mockCategories } from "@/data/mock";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 bg-[#007BFF]/10 text-[#007BFF] text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Explore Collections
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#111827] tracking-tight">
            Browse by Category
          </h1>
          <p className="text-gray-500 mt-3 text-base sm:text-lg">
            Discover thousands of high-quality products across all top categories.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
                <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#007BFF]/30 transition-all duration-300 h-64 flex flex-col justify-end p-6">
                  {/* Background Image */}
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Icon & Details */}
                  <div className="relative z-10">
                    <span className="text-3xl mb-2 block">{category.icon}</span>
                    <h2 className="text-2xl font-black text-white">{category.name}</h2>
                    <p className="text-white/70 text-sm mt-1">{category.productCount.toLocaleString()} Products available</p>
                    
                    <div className="mt-4 inline-flex items-center gap-2 text-white font-bold text-sm group-hover:text-[#5AA8FF] transition-colors">
                      <span>Explore Category</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
