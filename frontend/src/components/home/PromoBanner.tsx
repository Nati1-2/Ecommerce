"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gift, Truck, Shield } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main promo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden min-h-[320px] flex items-center"
          >
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
              alt="Upgrade Your Lifestyle"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/90 via-[#111827]/70 to-transparent" />
            <div className="relative z-10 p-8 sm:p-10 max-w-sm">
              <span className="inline-block bg-[#007BFF] text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                SUMMER COLLECTION 2026
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Upgrade Your<br />Lifestyle
              </h2>
              <p className="text-gray-300 mt-3 text-sm leading-relaxed">
                Explore our curated collection of premium products designed for modern living.
              </p>
              <Link
                href="/collections/summer"
                className="inline-flex items-center gap-2 mt-6 bg-[#007BFF] hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/30"
              >
                Shop Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Side promos */}
          <div className="flex flex-col gap-6">
            {/* Gaming promo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative rounded-3xl overflow-hidden min-h-[148px] flex items-center"
            >
              <img
                src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80"
                alt="Gaming"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#6D28D9]/90 to-[#6D28D9]/30" />
              <div className="relative z-10 p-6 sm:p-8">
                <span className="text-purple-200 text-xs font-bold uppercase tracking-widest">Game On</span>
                <h3 className="text-2xl font-black text-white mt-1">Level Up Your Setup</h3>
                <Link href="/category/gaming" className="inline-flex items-center gap-1 text-purple-200 text-sm font-semibold mt-3 hover:gap-2 transition-all">
                  Shop Gaming <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Beauty promo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden min-h-[148px] flex items-center"
            >
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"
                alt="Beauty"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#BE185D]/90 to-[#BE185D]/20" />
              <div className="relative z-10 p-6 sm:p-8">
                <span className="text-pink-200 text-xs font-bold uppercase tracking-widest">Beauty Essentials</span>
                <h3 className="text-2xl font-black text-white mt-1">Glow Up Season</h3>
                <Link href="/category/beauty" className="inline-flex items-center gap-1 text-pink-200 text-sm font-semibold mt-3 hover:gap-2 transition-all">
                  Shop Beauty <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8"
        >
          {[
            { icon: Truck, title: "Free Express Shipping", desc: "On orders over $50 • 2-day delivery", color: "text-blue-500", bg: "bg-blue-50" },
            { icon: Gift, title: "Free Gift Wrapping", desc: "Make any order special", color: "text-rose-500", bg: "bg-rose-50" },
            { icon: Shield, title: "2-Year Warranty", desc: "On all electronics", color: "text-green-500", bg: "bg-green-50" },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors bg-white">
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <p className="font-bold text-[#111827] text-sm">{title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
