"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Toggle({ checked, onChange, disabled = false, size = "md" }: ToggleProps) {
  const sizes = {
    sm: { width: "w-8", height: "h-4", thumb: "w-3 h-3", translate: "translate-x-4" },
    md: { width: "w-11", height: "h-6", thumb: "w-5 h-5", translate: "translate-x-5" },
    lg: { width: "w-14", height: "h-8", thumb: "w-7 h-7", translate: "translate-x-6" },
  };

  const currentSize = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700",
        disabled && "opacity-50 cursor-not-allowed",
        currentSize.width,
        currentSize.height
      )}
    >
      <span className="sr-only">Toggle setting</span>
      <motion.span
        layout
        className={cn(
          "pointer-events-none inline-block rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          currentSize.thumb,
          checked ? currentSize.translate : "translate-x-0"
        )}
      />
    </button>
  );
}
