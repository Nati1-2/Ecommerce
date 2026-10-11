"use client";

import { useAdminProductStore } from "@/store/adminProductStore";
import { Download, Layers } from "lucide-react";
import AdminPageHeader from "@/components/AdminShared/AdminPageHeader";

export default function ProductHeader() {
  const setIsCategoryManagerOpen = useAdminProductStore((state) => state.setIsCategoryManagerOpen);
  const setIsExportModalOpen = useAdminProductStore((state) => state.setIsExportModalOpen);

  return (
    <AdminPageHeader
      title="Product Catalog & Governance"
      description="Review submitted seller products, inspect high-res media, verify pricing compliance, and moderate catalog listings."
      breadcrumbs={[{ label: "Products" }]}
      badge="Catalog Moderation"
      badgeVariant="violet"
      actions={
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Products</span>
          </button>

          <button
            onClick={() => setIsCategoryManagerOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Manage Categories</span>
          </button>
        </div>
      }
    />
  );
}
