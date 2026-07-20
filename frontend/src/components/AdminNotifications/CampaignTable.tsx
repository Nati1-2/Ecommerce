"use client";

import { useNotificationCampaigns } from "@/hooks/useAdminNotificationQuery";
import { Megaphone, Play, Pause, Trash2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CampaignTable() {
  const { data: campaigns = [], isLoading } = useNotificationCampaigns();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Running":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800";
      case "Scheduled":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
      case "Completed":
        return "bg-blue-50 text-blue-600 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-emerald-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Marketing Communication Campaigns</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">{campaigns.length} Active Campaigns</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">Campaign Name</th>
              <th className="py-3 px-4">Channel</th>
              <th className="py-3 px-4">Audience</th>
              <th className="py-3 px-4">Sent Count</th>
              <th className="py-3 px-4">Open Rate</th>
              <th className="py-3 px-4">CTR</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{c.name}</td>
                <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-semibold">{c.channel}</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{c.audience}</td>
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{c.sentCount.toLocaleString()}</td>
                <td className="py-3 px-4 font-bold text-emerald-600">{c.openRate > 0 ? `${c.openRate}%` : "N/A"}</td>
                <td className="py-3 px-4 font-bold text-purple-600">{c.clickRate > 0 ? `${c.clickRate}%` : "N/A"}</td>
                <td className="py-3 px-4">
                  <span className={cn("px-2.5 py-0.5 rounded-full border text-[10px] font-bold", getStatusBadge(c.status))}>
                    {c.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 text-rose-500 hover:text-rose-700">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
