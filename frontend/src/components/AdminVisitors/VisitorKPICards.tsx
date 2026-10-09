"use client";

import { Users, Radio, Compass, Smartphone } from "lucide-react";
import { VisitorStats } from "@/types/adminVisitors";

interface KPICardsProps {
  stats: VisitorStats;
}

export default function VisitorKPICards({ stats }: KPICardsProps) {
  const mobileShare = stats.deviceBreakdown.find((d) => d.deviceType === "Mobile")?.percentage || 0;
  const desktopShare = stats.deviceBreakdown.find((d) => d.deviceType === "Desktop")?.percentage || 0;

  const cards = [
    {
      title: "Total Tracked Visits",
      value: stats.totalVisits.toLocaleString(),
      subtitle: `${stats.uniqueIps} unique IP addresses`,
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      bgColor: "bg-blue-50/70",
      borderColor: "border-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Live Active Visitors",
      value: stats.liveActive.toLocaleString(),
      subtitle: "Active in the last 15 minutes",
      icon: Radio,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50/70",
      borderColor: "border-emerald-100",
      textColor: "text-emerald-600",
      badge: "Real-time",
    },
    {
      title: "Top Acquisition Channel",
      value: stats.topSource.name || "Direct Access",
      subtitle: `${stats.topSource.percentage}% of overall traffic (${stats.topSource.type})`,
      icon: Compass,
      color: "from-violet-600 to-purple-600",
      bgColor: "bg-violet-50/70",
      borderColor: "border-violet-100",
      textColor: "text-violet-600",
    },
    {
      title: "Device Distribution",
      value: `${mobileShare}% Mobile`,
      subtitle: `${desktopShare}% Desktop / PC`,
      icon: Smartphone,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50/70",
      borderColor: "border-amber-100",
      textColor: "text-amber-600",
      isProgress: true,
      progressVal: mobileShare,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                  {card.title}
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1 truncate">
                  {card.value}
                </div>
              </div>

              <div
                className={`w-11 h-11 rounded-2xl ${card.bgColor} ${card.textColor} border ${card.borderColor} flex items-center justify-center shrink-0 shadow-sm`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium truncate">{card.subtitle}</span>
              {card.badge && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {card.badge}
                </span>
              )}
            </div>

            {card.isProgress && (
              <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${card.progressVal}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
