"use client";

import { useState } from "react";
import { useAdminAuditStore } from "@/store/adminAuditStore";
import { useExportAuditLogs } from "@/hooks/useAdminAuditQuery";
import { FileText, X, Download, ShieldCheck } from "lucide-react";

export default function ComplianceReports() {
  const { isComplianceModalOpen, setIsComplianceModalOpen } = useAdminAuditStore();
  const exportMutation = useExportAuditLogs();

  const [reportType, setReportType] = useState("SOC2");
  const [format, setFormat] = useState<"pdf" | "csv" | "excel">("pdf");

  if (!isComplianceModalOpen) return null;

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    exportMutation.mutate(format);
    setIsComplianceModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Compliance Report Generator
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Export SOC2, ISO 27001 & PCI-DSS audit trails</p>
            </div>
          </div>
          <button onClick={() => setIsComplianceModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleExport} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Compliance Standard *</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold"
            >
              <option value="SOC2">SOC 2 Type II Security & Audit Report</option>
              <option value="ISO27001">ISO 27001 Information Security Report</option>
              <option value="PCIDSS">PCI-DSS Payment Card Compliance Audit</option>
              <option value="GDPR">GDPR Data Access & Change Trail</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Export File Format *</label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {(["pdf", "csv", "excel"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`p-2.5 rounded-xl border text-center font-bold transition-all uppercase ${
                    format === fmt
                      ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsComplianceModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={exportMutation.isPending}
              className="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Generate & Download
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
