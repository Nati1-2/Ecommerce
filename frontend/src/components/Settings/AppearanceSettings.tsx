"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { useEffect, useState } from "react";

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="p-6 sm:p-10 min-h-[300px]" />;

  const options = [
    { id: "light", label: "Light", icon: Sun, desc: "Clean and bright" },
    { id: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
    { id: "system", label: "System", icon: Laptop, desc: "Matches your device" },
  ];

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Appearance</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Customize how the interface looks on your device.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.id;

          return (
            <button
              key={option.id}
              onClick={() => setTheme(option.id)}
              className={`relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                isActive
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-500/10 dark:border-blue-500"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/80"
              }`}
            >
              <div className={`p-4 rounded-full mb-4 ${
                isActive ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              }`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className={`text-lg font-semibold ${isActive ? "text-blue-900 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>
                {option.label}
              </h3>
              <p className={`text-sm mt-1 text-center ${isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`}>
                {option.desc}
              </p>

              {isActive && (
                <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-500/20" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
