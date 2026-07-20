"use client";

import { useAdminAuditStore, AuditViewTab } from "@/store/adminAuditStore";
import { ShieldCheck, Download, FileText, Clock } from "lucide-react";

export default function AuditHeader() {
  const {
    activeViewTab,
    setActiveViewTab,
    setIsComplianceModalOpen,
    setIsRetentionModalOpen,
  } = useAdminAuditStore();

  const tabs: { id: AuditViewTab; label: string }[] = [
    { id: "logs", label: "Audit Logs Table" },
    { id: "timeline", label: "Activity Timeline" },
    { id: "security-events", label: "Anomaly Detection" },
    { id: "logins", label: "Login Tracking" },
    { id: "alerts", label: "Security Alert Center" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
            Audit Logs & SIEM Security Monitoring
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Realtime security telemetry, administrative audit trail, and OpenSearch compliance logging.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsRetentionModalOpen(true)}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Retention Policy</span>
          </button>

          <button
            onClick={() => setIsComplianceModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-500/25 flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Security Report (SOC2)</span>
          </button>
        </div>
      </div>

      {/* Navigation View Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold">
        {tabs.map((tab) => {
          const isSel = activeViewTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveViewTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                isSel
                  ? "bg-blue-600 text-white font-bold shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
