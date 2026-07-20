"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/lib/utils";

export default function Toast() {
  const { toast, hideToast } = useSettingsStore();

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />
  };

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-lg px-4 py-3 min-w-[300px]"
        >
          {icons[toast.type]}
          <p className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
            {toast.message}
          </p>
          <button
            onClick={hideToast}
            className="p-1 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
