"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

interface CountdownProps {
  endTime: Date;
}

function Countdown({ endTime }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, endTime.getTime() - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ hours: h, minutes: m, seconds: s });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      {[
        { label: "HRS", val: timeLeft.hours },
        { label: "MIN", val: timeLeft.minutes },
        { label: "SEC", val: timeLeft.seconds },
      ].map(({ label, val }, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="bg-[#111827] text-white font-black text-2xl sm:text-3xl w-16 sm:w-20 h-16 sm:h-20 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <span>{pad(val)}</span>
            <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 tracking-widest mt-0.5">{label}</span>
          </div>
          {i < 2 && <span className="text-2xl font-black text-red-400">:</span>}
        </div>
      ))}
    </div>
  );
}

interface FlashSaleCardProps {
  product: Product;
  index: number;
  soldPercent: number;
}

function FlashSaleCard({ product, index, soldPercent }: FlashSaleCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1, image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-gray-200/80 border border-gray-100 hover:border-red-100 transition-all duration-300"
    >
      <div className="relative aspect-square bg-[#F5F7FA] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-md">
          -{product.discount}%
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-[#111827] line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1.5">
          {[1,2,3,4,5].map(s => (
            <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.reviewCount.toLocaleString()})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-black text-red-500">{formatPrice(product.price)}</span>
          <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
        </div>

        {/* Sold progress */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span className="font-medium text-gray-600">Sold: {soldPercent}%</span>
            <span>{100 - soldPercent} left</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${soldPercent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full mt-3 py-2.5 rounded-xl text-sm font-bold bg-[#111827] hover:bg-[#007BFF] text-white transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          {added ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}

interface FlashSaleProps {
  products: Product[];
}

export function FlashSale({ products }: FlashSaleProps) {
  const endTime = new Date(Date.now() + 6 * 3600 * 1000 + 34 * 60 * 1000);

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header banner strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-red-200">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-black text-xl sm:text-2xl">Flash Sale</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">LIVE</span>
              </div>
              <p className="text-gray-500 text-sm mt-0.5">Up to <strong className="text-red-500">50% OFF</strong> — Hurry, deals expire soon!</p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Ends In</p>
            <Countdown endTime={endTime} />
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product, i) => (
            <FlashSaleCard
              key={product.id}
              product={product}
              index={i}
              soldPercent={[78, 45, 92, 60][i] || 50}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
