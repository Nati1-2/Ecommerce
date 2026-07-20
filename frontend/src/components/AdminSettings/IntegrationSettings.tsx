"use client";

import { useIntegrations, useToggleIntegration } from "@/hooks/useAdminSettingsQuery";
import { Link, CheckCircle2, XCircle, Settings } from "lucide-react";

export default function IntegrationSettings() {
  const { data: integrations = [], isLoading } = useIntegrations();
  const toggleMutation = useToggleIntegration();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Link className="w-5 h-5 text-blue-600" />
          Third-Party API Integrations & Connected Services
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage external cloud infrastructure integrations, OAuth single sign-on, and search indexers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {integrations.map((item) => {
          const isConn = item.status === "Connected";

          return (
            <div
              key={item.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</h4>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                    isConn
                      ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                  }`}
                >
                  {isConn ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {item.status}
                </span>
              </div>
              <p className="text-slate-500">{item.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    toggleMutation.mutate({
                      id: item.id,
                      status: isConn ? "Disconnected" : "Connected",
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    isConn
                      ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isConn ? "Disconnect" : "Connect Gateway"}
                </button>
                <button type="button" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1">
                  <Settings className="w-3.5 h-3.5" /> Configure
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
