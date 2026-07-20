"use client";

import { useState } from "react";
import { useAdminAnalyticsStore } from "@/store/adminAnalyticsStore";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { X, Download, FileSpreadsheet, FileText } from "lucide-react";

export default function ExportReports() {
  const { isExportModalOpen, setIsExportModalOpen } = useAdminAnalyticsStore();
  const showToast = useAdminDashboardStore((state) => state.showToast);
  const [format, setFormat] = useState<"PDF" | "CSV" | "Excel">("PDF");
  const [reportType, setReportType] = useState("Executive GMV & Revenue Report");

  if (!isExportModalOpen) return null;

  const handleExport = () => {
    showToast(`Analytics report exported as ${format} (${reportType})`, "success");
    setIsExportModalOpen(false);
  };

  const formatsList = [
    { name: "PDF" as const, desc: "Executive presentation deck", icon: FileText },
    { name: "CSV" as const, desc: "Raw data dump for BI tools", icon: FileText },
    { name: "Excel" as const, desc: "Spreadsheet with calculations (.xlsx)", icon: FileSpreadsheet },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Export Analytics Report
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Generate marketplace business intelligence</p>
            </div>
          </div>
          <button onClick={() => setIsExportModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Select Export Format</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {formatsList.map((f) => {
                const isSel = format === f.name;

                return (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => setFormat(f.name)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      isSel
                        ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400 font-bold"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <f.icon className="w-4 h-4" />
                    <span>{f.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 font-medium">Select Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="Executive GMV & Revenue Report">Executive GMV & Revenue Report</option>
              <option value="Sales & Conversion Funnel Report">Sales & Conversion Funnel Report</option>
              <option value="Vendor Performance Leaderboard">Vendor Performance Leaderboard</option>
              <option value="Customer Journey & Behavior Audit">Customer Journey & Behavior Audit</option>
              <option value="Marketing Traffic & ROAS Attribution">Marketing Traffic & ROAS Attribution</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsExportModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
