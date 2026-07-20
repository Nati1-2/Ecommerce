"use client";

import { ProductQualityCheckDetails } from "@/types/adminProduct";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface Props {
  check: ProductQualityCheckDetails;
}

export default function ProductQualityCheck({ check }: Props) {
  const items = [
    { label: "High-Res Images Uploaded (Min 1000x1000px)", passed: check.imagesUploaded },
    { label: "Detailed Product Description (>100 Words)", passed: check.descriptionComplete },
    { label: "Taxonomy Category Assigned", passed: check.categorySelected },
    { label: "Price Valid & Within MSRP Bounds", passed: check.priceValid },
    { label: "Inventory Stock Available (>0 units)", passed: check.inventoryAvailable },
    { label: "Policy Compliant (No Trademark Counterfeit)", passed: check.policyCompliant },
  ];

  const passedCount = items.filter((i) => i.passed).length;
  const score = Math.round((passedCount / items.length) * 100);

  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          Automated Product Quality Score
        </h4>
        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          {score}% Quality Score ({passedCount}/6 Passed)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {items.map((item) => (
          <div
            key={item.label}
            className={`p-2.5 rounded-xl border flex items-center gap-2 ${
              item.passed
                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400"
                : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-400"
            }`}
          >
            {item.passed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
            <span className="font-semibold text-[11px]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
