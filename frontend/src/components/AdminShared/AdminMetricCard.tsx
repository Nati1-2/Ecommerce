"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";

interface AdminMetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  growth?: number;
  comparison?: string;
  className?: string;
  variant?: "primary" | "emerald" | "amber" | "violet" | "slate";
  onClick?: () => void;
}

export default function AdminMetricCard({
  title,
  value,
  icon: Icon,
  growth,
  comparison,
  className,
  variant = "primary",
  onClick,
}: AdminMetricCardProps) {
  const isPositive = growth !== undefined && growth > 0;
  const isNegative = growth !== undefined && growth < 0;
  const isZero = growth !== undefined && growth === 0;

  const iconBgClasses: Record<string, string> = {
    primary: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/60",
    emerald: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/60",
    amber: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/60",
    violet: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-900/60",
    slate: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between",
        onClick && "cursor-pointer hover:border-blue-400/60 dark:hover:border-blue-500/40",
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
            {title}
          </span>
          <div
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105",
              iconBgClasses[variant] || iconBgClasses.primary
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
      </div>

      {(growth !== undefined || comparison) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold gap-2">
          {growth !== undefined ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black shrink-0",
                isPositive && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60",
                isNegative && "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60",
                isZero && "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              )}
            >
              {isPositive && <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
              {isNegative && <TrendingDown className="w-3 h-3 text-rose-600 dark:text-rose-400" />}
              {isZero && <Minus className="w-3 h-3 text-slate-500" />}
              <span>{isPositive ? `+${growth}%` : `${growth}%`}</span>
            </span>
          ) : null}

          {comparison ? (
            <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium truncate text-right">
              {comparison}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
