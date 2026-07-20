"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface PaymentSuccessProps {
  orderId: string;
  transactionId: string;
  amount: number;
}

export default function PaymentSuccess({
  orderId,
  transactionId,
  amount,
}: PaymentSuccessProps) {
  return (
    <div className="max-w-md mx-auto py-12 px-6 text-center select-none space-y-6">
      {/* Circle animation success */}
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm"
        >
          <Check className="w-10 h-10 stroke-[3px]" />
        </motion.div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          Payment Successful!
        </h2>
        <p className="text-xs text-gray-400 font-semibold max-w-sm mx-auto leading-relaxed">
          Thank you for your purchase. We&apos;ve sent your order confirmation and details to your email address.
        </p>
      </div>

      {/* Details Box */}
      <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl text-left space-y-3.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-bold">Order ID</span>
          <span className="text-gray-900 font-black">#{orderId}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-bold">Transaction Reference</span>
          <span className="text-gray-900 font-bold font-mono text-[10px] select-all">
            {transactionId}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-bold">Amount Paid</span>
          <span className="text-gray-900 font-black text-sm">{formatPrice(amount)}</span>
        </div>
        <div className="border-t border-gray-200/50 pt-3 flex items-center gap-2 text-[10px] text-gray-400 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Payment secured & processed via Stripe API Gateway</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/"
          className="flex-1 py-3 px-5 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/15 flex items-center justify-center gap-1.5 transition-all"
        >
          Continue Shopping
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href={`/orders?id=${orderId}`}
          className="flex-1 py-3 px-5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
        >
          <Mail className="w-3.5 h-3.5 text-gray-400" />
          Track Order
        </Link>
      </div>
    </div>
  );
}
