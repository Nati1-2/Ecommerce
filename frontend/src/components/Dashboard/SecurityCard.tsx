"use client";

import { ShieldCheck, CheckCircle, Smartphone, KeyRound } from "lucide-react";

export default function SecurityCard({ onManage }: { onManage?: () => void }) {
  const securitySteps = [
    {
      label: "Email Verification",
      icon: CheckCircle,
      status: "Verified",
      color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800",
    },
    {
      label: "Mobile Number",
      icon: Smartphone,
      status: "Verified",
      color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800",
    },
    {
      label: "Two-Factor Auth (2FA)",
      icon: KeyRound,
      status: "Enabled",
      color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800",
    },
  ];

  return (
    <div className="p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 shadow-xs space-y-4 sm:space-y-5 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
          Security Credentials
        </h3>
        <button
          onClick={onManage}
          className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          Manage
        </button>
      </div>

      <div className="space-y-3 text-xs font-semibold">
        {securitySteps.map((step) => (
          <div
            key={step.label}
            className="flex items-center justify-between p-3.5 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400">
                <step.icon className="w-4 h-4" />
              </div>
              <span className="text-slate-800 dark:text-slate-200 font-bold">{step.label}</span>
            </div>

            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 border ${step.color}`}>
              {step.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
