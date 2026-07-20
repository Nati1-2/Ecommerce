"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutStepsProps {
  currentStep: "cart" | "address" | "shipping" | "payment" | "complete";
}

const STEPS = [
  { key: "cart", label: "Cart" },
  { key: "address", label: "Address" },
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
  { key: "complete", label: "Complete" },
];

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const getStepIndex = (key: string) => STEPS.findIndex((s) => s.key === key);
  const activeIndex = getStepIndex(currentStep);

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 select-none">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 -z-10" />

        {/* Dynamic active track line progress */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#007BFF] -z-10 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: activeIndex / (STEPS.length - 1) }}
          transition={{ duration: 0.4 }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = activeIndex > idx;
          const isActive = activeIndex === idx;

          return (
            <div key={step.key} className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? "#007BFF" : "#FFFFFF",
                  borderColor: isCompleted || isActive ? "#007BFF" : "#E5E7EB",
                  color: isCompleted || isActive ? "#FFFFFF" : "#9CA3AF",
                  scale: isActive ? 1.15 : 1,
                }}
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-sm z-10"
                )}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </motion.div>
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-bold transition-colors",
                  isActive ? "text-[#007BFF]" : isCompleted ? "text-gray-900" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
