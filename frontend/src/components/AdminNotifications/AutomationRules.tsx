"use client";

import { useAutomationRules } from "@/hooks/useAdminNotificationQuery";
import { Zap, Play, CheckCircle2 } from "lucide-react";

export default function AutomationRules() {
  const { data: rules = [], isLoading } = useAutomationRules();

  if (isLoading) {
    return <div className="h-56 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Event-Driven Automation Trigger Rules</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">{rules.length} Rules Active</span>
      </div>

      <div className="space-y-3 text-xs">
        {rules.map((r) => (
          <div
            key={r.id}
            className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2"
          >
            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-900 dark:text-white">{r.name}</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full font-bold text-[10px]">
                {r.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-800 font-mono text-[11px]">
              <span>WHEN: <strong className="text-blue-600 dark:text-blue-400">{r.triggerEvent}</strong></span>
              <span>SEND: <strong className="text-purple-600 dark:text-purple-400">{r.actionChannel} ({r.templateName})</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
