"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Star, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle background decoration — light blue & warm orange blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-orange-500/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-[#5AA8FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[300px] h-[300px] bg-orange-500/4 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 lg:pt-14 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-7">

            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 bg-[#007BFF]/8 border border-[#007BFF]/20 text-[#007BFF] text-sm font-semibold px-4 py-1.5 rounded-full">
                <Zap className="w-3.5 h-3.5 fill-[#007BFF]" />
                New Summer Collection is here
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-[68px] font-black text-[#111827] leading-[1.06] tracking-tight"
            >
              Shop{" "}
              <span className="relative">
                <span className="relative z-10 text-[#007BFF]">Everything</span>
                {/* underline accent */}
                <svg
                  aria-hidden
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 8 Q50 0 100 6 Q150 12 200 4"
                    stroke="#007BFF"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.35"
                  />
                </svg>
              </span>
              <br />
              You Love.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="text-lg text-gray-500 max-w-[460px] leading-relaxed"
            >
              Discover premium products from the world's top brands — fast delivery, secure payment, and hassle-free returns.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 bg-[#007BFF] hover:bg-blue-600 text-white font-bold px-7 py-3.5 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 text-[15px]"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 border-2 border-gray-200 hover:border-[#007BFF]/40 bg-white hover:bg-blue-50/50 text-[#111827] font-semibold px-7 py-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 text-[15px]"
              >
                Explore Categories
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-5 pt-1"
            >
              {[
                { icon: Truck, text: "Free Shipping $50+" },
                { icon: ShieldCheck, text: "Secure Payment" },
                { icon: Star, text: "4.9 / 5 Rating" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-gray-500">
                  <Icon className="w-4 h-4 text-[#007BFF]" />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN ─────────────────────────────────────────── */}
          <div className="relative flex items-center justify-center lg:justify-end">

            {/* Floating image card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 80 }}
              className="relative"
            >
              {/* Slow float animation */}
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Card wrapper */}
                <div className="relative w-[300px] sm:w-[360px] lg:w-[400px] rounded-3xl overflow-hidden bg-[#F5F7FA] border border-gray-100 shadow-2xl shadow-gray-200/80">
                  <img
                    src="/iphone17.png"
                    alt="Featured Product — iPhone 17 Pro"
                    className="w-full h-[280px] sm:h-[320px] object-contain object-center p-6 bg-white"
                  />

                  {/* Product info strip inside card */}
                  <div className="p-5 bg-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#007BFF] uppercase tracking-wide">Apple</p>
                        <p className="font-bold text-[#111827] mt-0.5">iPhone 17 Pro</p>
                        <div className="flex items-center gap-1 mt-1.5">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">(942)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-[#111827]">$1,199</p>
                        <p className="text-xs text-gray-400 line-through">$1,399</p>
                      </div>
                    </div>
                    <div className="mt-3 w-full py-2.5 bg-[#007BFF] text-white text-sm font-bold rounded-xl text-center">
                      Add to Cart
                    </div>
                  </div>

                  {/* Discount badge */}
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg">
                    -14% OFF
                  </div>
                </div>

                {/* Floating chip: Orders */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="absolute -left-10 top-16 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-base">🎉</div>
                  <div>
                    <p className="text-xs font-bold text-[#111827]">942 sold</p>
                    <p className="text-[10px] text-gray-400">This week</p>
                  </div>
                </motion.div>

                {/* Floating chip: Delivery */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                  className="absolute -right-6 bottom-24 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-2"
                >
                  <Truck className="w-4 h-4 text-[#007BFF]" />
                  <div>
                    <p className="text-[11px] font-bold text-[#111827]">Free Express</p>
                    <p className="text-[10px] text-gray-400">2-day delivery</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ── STATS BAR ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-16 lg:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { value: "500K+", label: "Happy Customers" },
            { value: "50K+", label: "Products" },
            { value: "120+", label: "Top Brands" },
            { value: "99.8%", label: "Satisfaction Rate" },
          ].map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.08 }}
              className="flex flex-col items-center justify-center py-5 px-4 bg-[#F5F7FA] rounded-2xl border border-gray-100 text-center"
            >
              <p className="text-2xl sm:text-3xl font-black text-[#007BFF]">{value}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
