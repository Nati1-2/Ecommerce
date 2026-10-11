"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: "blue" | "emerald" | "amber" | "violet" | "slate";
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
}

export default function AdminPageHeader({
  title,
  description,
  badge,
  badgeVariant = "blue",
  breadcrumbs,
  actions,
  className,
}: AdminPageHeaderProps) {
  const badgeClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/80 dark:border-blue-900/80",
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-900/80",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/80 dark:border-amber-900/80",
    violet: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-900/80",
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-slate-200/60 dark:border-slate-800/60",
        className
      )}
    >
      <div className="space-y-1 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
            <Link href="/admin/dashboard" className="hover:text-blue-600 transition-colors">
              Admin
            </Link>
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                {b.href ? (
                  <Link href={b.href} className="hover:text-blue-600 transition-colors truncate max-w-[150px]">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-slate-600 dark:text-slate-300 font-bold truncate max-w-[150px]">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {badge && (
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-[11px] font-black border uppercase tracking-wider",
                badgeClasses[badgeVariant] || badgeClasses.blue
              )}
            >
              {badge}
            </span>
          )}
        </div>

        {description && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-center">
          {actions}
        </div>
      )}
    </div>
  );
}
