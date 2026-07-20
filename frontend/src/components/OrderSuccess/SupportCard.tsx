"use client";

import { HelpCircle, Mail, Phone, ShieldAlert, ArrowLeftRight } from "lucide-react";

export default function SupportCard() {
  const supportItems = [
    {
      icon: Phone,
      title: "Call customer support",
      value: "+1 (800) 555-AURA",
    },
    {
      icon: Mail,
      title: "Email help desk",
      value: "support@aurastore.com",
    },
    {
      icon: ArrowLeftRight,
      title: "Hassle-free returns",
      value: "30-day standard return policy",
    },
  ];

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-5 select-none">
      <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
        <HelpCircle className="w-4.5 h-4.5 text-gray-400" />
        Need Help?
      </h3>

      <div className="space-y-4">
        {supportItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex gap-3.5 items-start">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#007BFF] flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {item.title}
                </p>
                <p className="text-xs font-black text-gray-900 mt-0.5 select-all">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
