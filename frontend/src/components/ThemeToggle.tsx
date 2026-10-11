"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "pill";
}

export default function ThemeToggle({ className = "", variant = "icon" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const currentTheme = resolvedTheme || theme || "light";
  const isDark = currentTheme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (variant === "pill") {
    return (
      <button
        onClick={handleToggle}
        type="button"
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
          isDark
            ? "bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-750 hover:border-slate-600"
            : "bg-white text-slate-700 border-slate-200/90 shadow-2xs hover:bg-slate-50 hover:text-slate-900"
        } ${className}`}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span className="text-slate-200">Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-700">Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      type="button"
      className={`relative p-2 rounded-xl transition-all duration-200 border group ${
        isDark
          ? "bg-slate-850 hover:bg-slate-800 text-amber-400 border-slate-700/80 hover:border-amber-400/40 shadow-xs"
          : "bg-white hover:bg-slate-100 text-slate-700 hover:text-blue-600 border-slate-200/90 hover:border-blue-300 shadow-2xs"
      } ${className}`}
      title={isDark ? "Switch to Light Mode (Default)" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode (Default)" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600 group-hover:text-blue-600 group-hover:-rotate-12 transition-transform duration-300" />
      )}
      <span className="sr-only">Toggle color mode</span>
    </button>
  );
}
