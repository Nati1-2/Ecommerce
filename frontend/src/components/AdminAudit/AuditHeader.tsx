"use client";

import { useAdminAuditStore, AuditViewTab } from "@/store/adminAuditStore";
import { ShieldCheck, Download, FileText, Clock } from "lucide-react";
import AdminPageHeader from "@/components/AdminShared/AdminPageHeader";

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
      <AdminPageHeader
        title="Audit Logs & SIEM Security Monitoring"
        description="Realtime security telemetry, administrative audit trail, and OpenSearch compliance logging."
        breadcrumbs={[{ label: "Audit Logs" }]}
        badge="SIEM Security"
        badgeVariant="blue"
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsRetentionModalOpen(true)}
              className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-2xs"
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Retention Policy</span>
            </button>

            <button
              onClick={() => setIsComplianceModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Security Report (SOC2)</span>
            </button>
          </div>
        }
      />

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
