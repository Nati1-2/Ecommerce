"use client";

import { ChangeHistoryModel } from "@/types/adminAudit";
import { ArrowRight, FileDiff } from "lucide-react";

export default function ChangeHistory({ diffs }: { diffs?: ChangeHistoryModel[] }) {
  if (!diffs || diffs.length === 0) return null;

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
        <FileDiff className="w-4 h-4 text-purple-500" />
        <span>Data Change History (Before vs After Diff)</span>
      </div>

      <div className="space-y-2">
        {diffs.map((d, idx) => (
          <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] space-y-1">
            <p className="font-bold text-slate-700 dark:text-slate-300">Field: {d.field}</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950/40 text-rose-600 rounded">
                - {String(d.oldValue)}
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded font-bold">
                + {String(d.newValue)}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5">Modified by: {d.changedBy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
