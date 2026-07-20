"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutStepsProps {
  currentStep: number;
}

const STEPS = [
  { number: 1, label: "Address" },
  { number: 2, label: "Shipping" },
  { number: 3, label: "Review" },
  { number: 4, label: "Payment" },
];

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 -z-10" />

        {/* Dynamic active track line progress */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#007BFF] -z-10 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentStep - 1) / (STEPS.length - 1) }}
          transition={{ duration: 0.4 }}
        />

        {STEPS.map((step) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div key={step.number} className="flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? "#007BFF" : "#FFFFFF",
                  borderColor: isCompleted || isActive ? "#007BFF" : "#E5E7EB",
                  color: isCompleted || isActive ? "#FFFFFF" : "#9CA3AF",
                  scale: isActive ? 1.15 : 1,
                }}
                className={cn(
                  "w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-sm z-10"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3px]" />
                ) : (
                  <span>{step.number}</span>
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
