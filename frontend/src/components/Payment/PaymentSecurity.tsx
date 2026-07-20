"use client";

import { ShieldCheck, Lock, ArrowLeftRight, Award } from "lucide-react";

export default function PaymentSecurity() {
  const securityItems = [
    {
      icon: Lock,
      label: "SSL Secure Payment",
      desc: "256-bit encryption",
    },
    {
      icon: ShieldCheck,
      label: "PCI Compliant",
      desc: "Certified level 1 standards",
    },
    {
      icon: Award,
      label: "Buyer Protection",
      desc: "Money-back assurance",
    },
    {
      icon: ArrowLeftRight,
      label: "Easy Refunds",
      desc: "30-day hassle-free return",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-5 bg-gray-50 border border-gray-100 rounded-2xl select-none">
      {securityItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center shrink-0 text-[#007BFF]">
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black text-gray-900 leading-snug">
                {item.label}
              </h4>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5 leading-tight">
                {item.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
