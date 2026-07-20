"use client";

import { useState } from "react";
import { AlertCircle, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cancelOrderApi } from "@/lib/api";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export default function CancelOrderModal({
  isOpen,
  onClose,
  orderId,
}: CancelOrderModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await cancelOrderApi(orderId);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          />

          {/* Modal overlay */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white border border-gray-100 rounded-3xl p-6 z-[60] shadow-2xl space-y-4 select-none"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-red-650">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <h4 className="text-sm font-black text-gray-900">Cancel Purchase</h4>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-50 text-gray-400 hover:text-gray-900 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <p className="text-gray-500 leading-relaxed">
                Are you sure you want to cancel order <strong className="text-gray-900 font-black">#{orderId}</strong>?
                This action will void the transaction and issue a refund to your original payment method.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                >
                  No, Keep Order
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-45 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Yes, Cancel"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
