"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/services/api/settings";
import { MonitorSmartphone, Globe, LogOut } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";

export default function ActiveSessions() {
  const { showToast } = useSettingsStore();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: settingsApi.getSessions,
  });

  const deleteMutation = useMutation({
    mutationFn: settingsApi.deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      showToast("Session logged out successfully");
    },
    onError: () => {
      showToast("Failed to logout session", "error");
    }
  });

  const deleteAllMutation = useMutation({
    mutationFn: settingsApi.deleteAllSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      showToast("All other sessions logged out");
    },
  });

  return (
    <div className="p-6 sm:p-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Sessions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage devices that are currently logged into your account.
          </p>
        </div>
        {sessions.length > 1 && (
          <button
            onClick={() => deleteAllMutation.mutate()}
            disabled={deleteAllMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            {deleteAllMutation.isPending ? "Logging out..." : "Logout all other devices"}
          </button>
        )}
      </div>

      <div className="space-y-4 max-w-3xl">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
            ))}
          </div>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="bg-white dark:bg-gray-800/50 p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded-xl shrink-0">
                  <MonitorSmartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {session.device} - {session.browser}
                    {session.isCurrent && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4" />
                      {session.location}
                    </span>
                    <span>•</span>
                    <span>Last active: {session.lastActive}</span>
                  </div>
                </div>
              </div>
              
              {!session.isCurrent && (
                <button
                  onClick={() => deleteMutation.mutate(session.id)}
                  disabled={deleteMutation.isPending && deleteMutation.variables === session.id}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                  title="Logout device"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
