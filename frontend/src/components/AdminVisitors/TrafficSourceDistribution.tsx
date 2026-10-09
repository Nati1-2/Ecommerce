"use client";

import {
  Search,
  Share2,
  Navigation,
  ExternalLink,
  Megaphone,
  Mail,
  HelpCircle,
} from "lucide-react";
import { VisitorStats, TrafficSourceType } from "@/types/adminVisitors";

interface SourceDistributionProps {
  stats: VisitorStats;
  selectedSource: string;
  onSelectSource: (source: string) => void;
}

export default function TrafficSourceDistribution({
  stats,
  selectedSource,
  onSelectSource,
}: SourceDistributionProps) {
  // Aggregate by high-level source categories
  const categories: Array<{
    type: TrafficSourceType;
    label: string;
    icon: any;
    color: string;
    bgColor: string;
    barColor: string;
    badgeBg: string;
  }> = [
    {
      type: "Search Engine",
      label: "Search Engines",
      icon: Search,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      barColor: "bg-blue-600",
      badgeBg: "bg-blue-100 text-blue-700",
    },
    {
      type: "Social Media",
      label: "Social Media",
      icon: Share2,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      barColor: "bg-pink-600",
      badgeBg: "bg-pink-100 text-pink-700",
    },
    {
      type: "Direct",
      label: "Direct Traffic",
      icon: Navigation,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      barColor: "bg-emerald-600",
      badgeBg: "bg-emerald-100 text-emerald-700",
    },
    {
      type: "Referral",
      label: "External Referrals",
      icon: ExternalLink,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      barColor: "bg-purple-600",
      badgeBg: "bg-purple-100 text-purple-700",
    },
    {
      type: "Campaign / Ad",
      label: "Campaigns & Ads",
      icon: Megaphone,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      barColor: "bg-amber-600",
      badgeBg: "bg-amber-100 text-amber-700",
    },
  ];

  // Calculate sum and percentage for each category
  const categoryStats = categories.map((cat) => {
    const items = stats.sourceBreakdown.filter((s) => s.type === cat.type);
    const totalCount = items.reduce((acc, curr) => acc + curr.count, 0);
    const percentage = stats.totalVisits > 0 ? Math.round((totalCount / stats.totalVisits) * 1000) / 10 : 0;
    return {
      ...cat,
      count: totalCount,
      percentage,
      topChannels: items.slice(0, 3),
    };
  });

  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Traffic Acquisition Sources
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Link & Origin Tracker
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            How visitors arrive at your storefront (Social links, Search algorithms, Direct bookmarks, or Referrals).
          </p>
        </div>

        {selectedSource !== "all" && (
          <button
            onClick={() => onSelectSource("all")}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 underline self-start sm:self-auto"
          >
            Clear Filter (Show All)
          </button>
        )}
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {categoryStats.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedSource.toLowerCase() === cat.type.toLowerCase();

          return (
            <button
              key={cat.type}
              onClick={() => onSelectSource(isSelected ? "all" : cat.type)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "border-blue-600 bg-blue-50/40 shadow-md ring-2 ring-blue-500/20"
                  : "border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className={`w-8 h-8 rounded-xl ${cat.bgColor} ${cat.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${cat.badgeBg}`}>
                  {cat.percentage}%
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800 truncate">{cat.label}</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">{cat.count.toLocaleString()} visits</div>
              </div>

              {/* Mini progress bar */}
              <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${cat.barColor}`}
                  style={{ width: `${Math.min(100, cat.percentage)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Top Channel Pills */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Top Inbound Acquisition Channels
        </span>
        <div className="flex flex-wrap gap-2">
          {stats.sourceBreakdown.slice(0, 8).map((channel, i) => (
            <button
              key={i}
              onClick={() => onSelectSource(channel.type)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            >
              <span className="font-bold">{channel.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white text-slate-500 border border-slate-200">
                {channel.count} ({channel.percentage}%)
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
