"use client";

import { AlertCircle, RefreshCw, CreditCard, LifeBuoy } from "lucide-react";
import { motion } from "framer-motion";

interface PaymentErrorProps {
  error: string | null;
  onRetry: () => void;
  onChangeMethod: () => void;
}

export default function PaymentError({
  error,
  onRetry,
  onChangeMethod,
}: PaymentErrorProps) {
  const getErrorMessage = () => {
    if (!error) return "An unexpected error occurred while processing your card.";
    if (error.includes("declined")) {
      return "Your credit card was declined. Please verify your card details or try another card.";
    }
    if (error.includes("funds")) {
      return "Transaction failed due to insufficient funds. Please check your card balance.";
    }
    if (error.includes("expired")) {
      return "Your credit card has expired. Please use a valid card.";
    }
    return error;
  };

  return (
    <div className="max-w-md mx-auto py-12 px-6 text-center select-none space-y-6">
      {/* Alert Icon warning */}
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-500 shadow-sm"
        >
          <AlertCircle className="w-8 h-8 stroke-[2px]" />
        </motion.div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">
          Payment Failed
        </h2>
        <p className="text-xs text-red-500/80 font-bold max-w-xs mx-auto leading-relaxed">
          {getErrorMessage()}
        </p>
      </div>

      {/* Security notice / suggestions */}
      <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-left text-[10px] text-gray-400 font-semibold space-y-2">
        <p className="text-gray-900 font-black">Troubleshooting Tips:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Check that card numbers, expiry date, and CVV are accurate.</li>
          <li>Contact your bank to ensure international purchases are authorized.</li>
          <li>Select a different checkout gateway like PayPal or Apple Pay.</li>
        </ul>
      </div>

      {/* Action triggers */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onRetry}
          className="flex-1 py-3 px-5 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/15 flex items-center justify-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Card Payment
        </button>
        <button
          onClick={onChangeMethod}
          className="flex-1 py-3 px-5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
        >
          <CreditCard className="w-3.5 h-3.5 text-gray-400" />
          Change Method
        </button>
      </div>

      <button className="text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1 mx-auto">
        <LifeBuoy className="w-3.5 h-3.5" />
        Need help? Contact Customer Support
      </button>
    </div>
  );
}
