"use client";

import { HelpCircle, Mail, Phone, ShieldAlert, ArrowLeftRight } from "lucide-react";

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-4.5 h-4.5"}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

export default function SupportCard() {
  const supportItems = [
    {
      icon: Mail,
      title: "Email help desk",
      value: "natnaelman368@gmail.com",
      href: "mailto:natnaelman368@gmail.com",
    },
    {
      icon: TelegramIcon,
      title: "Telegram support",
      value: "@natimanboss",
      href: "https://t.me/natimanboss",
    },
    {
      icon: Phone,
      title: "Call customer support",
      value: "+1 (800) 555-NATI",
      href: "tel:+18005556284",
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
          const Wrapper = item.href ? "a" : "div";
          const wrapperProps = item.href
            ? {
                href: item.href,
                target: item.href.startsWith("http") ? "_blank" : undefined,
                rel: item.href.startsWith("http") ? "noopener noreferrer" : undefined,
                className: "flex gap-3.5 items-start group hover:opacity-90 transition-opacity",
              }
            : { className: "flex gap-3.5 items-start" };

          return (
            <Wrapper key={idx} {...(wrapperProps as any)}>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#007BFF] flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {item.title}
                </p>
                <p className="text-xs font-black text-gray-900 mt-0.5 select-all group-hover:text-[#007BFF] transition-colors">
                  {item.value}
                </p>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
