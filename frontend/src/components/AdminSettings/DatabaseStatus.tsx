"use client";

import { useBackups, useCreateBackup } from "@/hooks/useAdminSettingsQuery";
import { Database, Download, Plus, HardDrive, CheckCircle2 } from "lucide-react";

export default function DatabaseStatus() {
  const { data: backups = [], isLoading } = useBackups();
  const createBackupMutation = useCreateBackup();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            PostgreSQL Database Cluster & Snapshot Backups
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monitor database storage capacity, automated daily snapshots, and on-demand backups.</p>
        </div>
        <button
          type="button"
          disabled={createBackupMutation.isPending}
          onClick={() => createBackupMutation.mutate()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Create Instant Backup</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-300">Cluster Status</span>
            <span className="text-emerald-600 flex items-center gap-1 font-bold text-[10px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy (Primary + 2 Replicas)
            </span>
          </div>
          <p className="text-slate-400">PostgreSQL 16.2 Enterprise Edition</p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-300">Storage Usage</span>
            <span className="font-bold text-blue-600">42.5 GB / 500 GB (8.5%)</span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full w-[8.5%]" />
          </div>
        </div>
      </div>

      {/* Backups List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">Backup Snapshot File</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Created Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {backups.map((bak) => (
              <tr key={bak.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{bak.fileName}</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{bak.sizeGb} GB</td>
                <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{bak.createdAt}</td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] font-bold">
                    {bak.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
