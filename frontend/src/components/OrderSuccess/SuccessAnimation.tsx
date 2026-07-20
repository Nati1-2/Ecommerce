"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function SuccessAnimation() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number }[]>([]);

  useEffect(() => {
    // Generate simulated confetti particles
    const colors = ["#007BFF", "#5AA8FF", "#16A34A", "#FBBF24", "#EC4899", "#8B5CF6"];
    const generated = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 350,
      y: -Math.random() * 200 - 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-6 overflow-visible">
      {/* Confetti Explosion */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: [0, 1, 1, 0.5, 0],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 1.8,
            ease: "easeOut",
            delay: 0.1,
          }}
          style={{
            position: "absolute",
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
            zIndex: 10,
          }}
        />
      ))}

      {/* Main checkmark ring circle */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-md relative z-20"
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Check className="w-10 h-10 stroke-[3px]" />
        </motion.div>
      </motion.div>

      {/* Confirmation Message */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center mt-6 space-y-2 z-20"
      >
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Order Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-semibold max-w-sm mx-auto leading-relaxed">
          Thank you for your purchase. Your order has been successfully placed and is now being processed.
        </p>
      </motion.div>
    </div>
  );
}
