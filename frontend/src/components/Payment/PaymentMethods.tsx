"use client";

import { usePaymentStore, PaymentMethodType } from "@/store/paymentStore";
import { CreditCard, Wallet, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PaymentMethodsProps {
  disabled?: boolean;
}

export default function PaymentMethods({ disabled = false }: PaymentMethodsProps) {
  const { paymentMethod, setPaymentMethod } = usePaymentStore();

  const methods: { id: PaymentMethodType; label: string; icon: any; color: string }[] = [
    {
      id: "card",
      label: "Credit Card",
      icon: CreditCard,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "paypal",
      label: "PayPal",
      icon: Wallet,
      color: "from-[#003087] to-[#0079C1]",
    },
    {
      id: "applepay",
      label: "Apple Pay",
      icon: Smartphone,
      color: "from-black to-gray-800",
    },
    {
      id: "googlepay",
      label: "Google Pay",
      icon: Smartphone,
      color: "from-gray-100 to-white",
    },
  ];

  return (
    <div className="space-y-4 select-none">
      <h3 className="text-base font-black text-gray-900">Select Payment Method</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {methods.map((method) => {
          const isSelected = paymentMethod === method.id;
          const Icon = method.icon;

          return (
            <motion.button
              key={method.id}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              disabled={disabled}
              onClick={() => setPaymentMethod(method.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border text-center transition-all cursor-pointer",
                isSelected
                  ? "border-[#007BFF] bg-blue-50/20 ring-2 ring-[#007BFF]/10 shadow-sm"
                  : "border-gray-100 hover:border-gray-300 bg-white"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  isSelected
                    ? "bg-[#007BFF] text-white"
                    : "bg-gray-50 text-gray-400 group-hover:text-gray-600"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-700">
                {method.label}
              </span>

              {/* Radio selection check */}
              {isSelected && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#007BFF]" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
