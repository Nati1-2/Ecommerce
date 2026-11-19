"use client";

import React from "react";
import { HotspotElement } from "@/types/userActivity";
import { Flame, MousePointerClick, Tag, Layers, TrendingUp } from "lucide-react";

interface ClickHotspotsCardProps {
  hotspots: HotspotElement[];
  totalClicksToday: number;
  onFilterHotspot?: (text: string) => void;
}

export const ClickHotspotsCard: React.FC<ClickHotspotsCardProps> = ({
  hotspots,
  totalClicksToday,
  onFilterHotspot,
}) => {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "ADD_TO_CART_CLICK":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CHECKOUT_CLICK":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "DONATE_CLICK":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "SEARCH_SUBMIT":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "BUTTON_CLICK":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "LINK_CLICK":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getBarColor = (index: number) => {
    const colors = [
      "from-violet-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-sky-500 to-blue-600",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-pink-600",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
              <Flame className="w-5 h-5" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Top Click Hotspots & Heatmap Elements
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Most interacted buttons, navigational links, and CTAs recorded across all active sessions today.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Calculated from <strong>{totalClicksToday.toLocaleString()}</strong> total clicks</span>
        </div>
      </div>

      {hotspots.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          No hotspot telemetry recorded yet. Click on storefront elements or use &ldquo;Simulate Real Click&rdquo; to populate.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotspots.map((item, idx) => {
            return (
              <div
                key={`${item.elementText}-${idx}`}
                onClick={() => onFilterHotspot && onFilterHotspot(item.elementText)}
                className="group relative p-3.5 rounded-xl border border-slate-100 hover:border-violet-200 bg-slate-50/50 hover:bg-violet-50/20 transition-all cursor-pointer"
                title={`Filter clickstream by "${item.elementText}"`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-slate-200 group-hover:bg-violet-100 text-slate-700 group-hover:text-violet-700 text-xs font-bold flex items-center justify-center transition-colors">
                      #{idx + 1}
                    </span>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-violet-700 transition-colors truncate">
                        &ldquo;{item.elementText}&rdquo;
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-400" />
                          &lt;{item.targetTag.toLowerCase()}&gt;
                        </span>
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md border ${getBadgeColor(
                            item.eventType
                          )}`}
                        >
                          {item.eventType.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                      {item.clickCount.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 block">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full bg-linear-to-r ${getBarColor(idx)} transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(4, item.percentage))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
