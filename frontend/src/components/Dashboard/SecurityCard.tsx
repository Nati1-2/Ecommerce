"use client";

import { ShieldCheck, Lock, CheckCircle, Smartphone, KeyRound } from "lucide-react";

export default function SecurityCard() {
  const securitySteps = [
    {
      label: "Email Verification",
      icon: CheckCircle,
      status: "Verified",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Mobile Number",
      icon: Smartphone,
      status: "Verified",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Two-Factor Auth (2FA)",
      icon: KeyRound,
      status: "Enabled",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-5 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-4.5 h-4.5 text-gray-400" />
          Security Credentials
        </h3>
        <button className="text-[10px] font-bold text-[#007BFF] hover:underline">
          Manage
        </button>
      </div>

      <div className="space-y-3.5 text-xs font-semibold">
        {securitySteps.map((step) => (
          <div
            key={step.label}
            className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200/50 flex items-center justify-center shrink-0 text-gray-500">
                <step.icon className="w-4 h-4" />
              </div>
              <span className="text-gray-900 font-bold">{step.label}</span>
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
