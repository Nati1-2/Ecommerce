"use client";

import { useState } from "react";
import { AlertCircle, X, Loader2, UploadCloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { returnOrderApi } from "@/lib/api";

interface ReturnOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export default function ReturnOrderModal({
  isOpen,
  onClose,
  orderId,
}: ReturnOrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("Incorrect size");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await returnOrderApi(orderId, { reason, description });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 z-[60] shadow-2xl space-y-4 select-none"
          >
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-black text-gray-900">Return Purchase</h4>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-50 text-gray-400 hover:text-gray-900 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {success ? (
              <div className="py-8 text-center space-y-2">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold">
                  ✓
                </span>
                <p className="text-xs font-black text-gray-900">Return Requested Successfully</p>
                <p className="text-[10px] text-gray-400 font-semibold">
                  A return shipping label has been generated and sent to your email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-left">
                {/* Reason */}
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
                    Reason for Return
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 cursor-pointer"
                  >
                    <option>Incorrect size / variant</option>
                    <option>Defective / damaged product</option>
                    <option>Changed mind / bought by mistake</option>
                    <option>Item not as described</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
                    Detailed Explanation
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us what went wrong..."
                    rows={3}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                  />
                </div>

                {/* Images Upload Mock */}
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
                    Upload Photos (Optional)
                  </label>
                  <div className="border border-dashed border-gray-200 hover:border-gray-300 rounded-xl p-6 text-center cursor-pointer bg-gray-50/50 flex flex-col items-center justify-center gap-1">
                    <UploadCloud className="w-6 h-6 text-gray-450" />
                    <p className="text-[10px] text-gray-400 font-bold">Click or drag photos of the item</p>
                    <p className="text-[8px] text-gray-300 font-semibold">Max size 5MB each</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-45 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Submit Request"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
