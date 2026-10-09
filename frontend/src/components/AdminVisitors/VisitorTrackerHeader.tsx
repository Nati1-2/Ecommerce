"use client";

import { useState } from "react";
import {
  Globe,
  Radio,
  RefreshCw,
  PlusCircle,
  Trash2,
  Download,
  CheckCircle2,
} from "lucide-react";
import { useSimulateVisitorHit, useClearVisitorLogs } from "@/hooks/useAdminVisitorsQuery";
import { VisitorLogItem } from "@/types/adminVisitors";

interface HeaderProps {
  isAutoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  onManualRefresh: () => void;
  isFetching: boolean;
  visitors: VisitorLogItem[];
  liveCount: number;
}

export default function VisitorTrackerHeader({
  isAutoRefresh,
  onToggleAutoRefresh,
  onManualRefresh,
  isFetching,
  visitors,
  liveCount,
}: HeaderProps) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const simulateMutation = useSimulateVisitorHit();
  const clearMutation = useClearVisitorLogs();

  const handleSimulate = async () => {
    try {
      await simulateMutation.mutateAsync();
      setToastMsg("Simulated visitor hit recorded!");
      setTimeout(() => setToastMsg(null), 3000);
    } catch {
      setToastMsg("Failed to simulate visitor");
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleClear = async () => {
    try {
      await clearMutation.mutateAsync();
      setShowClearConfirm(false);
      setToastMsg("Visitor tracking logs cleared");
      setTimeout(() => setToastMsg(null), 3000);
    } catch {
      setToastMsg("Failed to clear logs");
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleExportCSV = () => {
    if (!visitors.length) return;
    const headers = [
      "ID",
      "IP Address",
      "Device Type",
      "Device Model",
      "Operating System",
      "Browser",
      "Country",
      "City",
      "Source Type",
      "Source Channel",
      "Referrer URL",
      "Path Visited",
      "Status",
      "Timestamp",
    ];

    const rows = visitors.map((v) => [
      v.id,
      v.ip,
      v.deviceType,
      `"${v.deviceModel || ""}"`,
      `"${v.os}"`,
      `"${v.browser}"`,
      `"${v.location?.country || ""}"`,
      `"${v.location?.city || ""}"`,
      `"${v.source?.type || ""}"`,
      `"${v.source?.name || ""}"`,
      `"${v.source?.referrer || ""}"`,
      `"${v.path}"`,
      v.status,
      v.visitedAt,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `visitor_tracking_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm">
        {/* Title & Live Status */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                Visitor Tracker
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {liveCount} Active Now
                </span>
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Real-time web traffic telemetry: inspect visitor IP addresses, device types (Mobile, PC, Tablet),
            operating systems, countries, and traffic acquisition channels (Social Media, Search Engines, Direct).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Auto Refresh Toggle */}
          <button
            onClick={onToggleAutoRefresh}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 ${
              isAutoRefresh
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
            title={isAutoRefresh ? "Auto-refreshing every 10s" : "Auto-refresh paused"}
          >
            <Radio className={`w-3.5 h-3.5 ${isAutoRefresh ? "text-emerald-500 animate-pulse" : "text-slate-400"}`} />
            <span>{isAutoRefresh ? "Live 10s" : "Paused"}</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={onManualRefresh}
            disabled={isFetching}
            className="p-2.5 rounded-2xl text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-blue-600" : ""}`} />
          </button>

          {/* Simulate Hit */}
          <button
            onClick={handleSimulate}
            disabled={simulateMutation.isPending}
            className="px-3.5 py-2 rounded-2xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors flex items-center gap-2"
            title="Generate a test simulated visitor hit"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{simulateMutation.isPending ? "Sending..." : "Simulate Visit"}</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            disabled={!visitors.length}
            className="px-3.5 py-2 rounded-2xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors flex items-center gap-2 disabled:opacity-40"
            title="Export visitor logs to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Clear Logs */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-colors"
            title="Clear all logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Clearing Logs */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Clear All Visitor Logs?</h3>
              <p className="text-xs text-slate-500">
                This will reset all recorded visitor tracking sessions. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                disabled={clearMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-md shadow-red-500/20"
              >
                {clearMutation.isPending ? "Clearing..." : "Yes, Clear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMsg && (
        <div className="absolute top-2 right-4 z-40 flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
