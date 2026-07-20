"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/services/api/settings";
import { useSettingsStore } from "@/store/settingsStore";
import { Check, X } from "lucide-react";

export default function ConnectedApps() {
  const { showToast } = useSettingsStore();
  const queryClient = useQueryClient();

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["apps"],
    queryFn: settingsApi.getConnectedApps,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, connect }: { id: string; connect: boolean }) => 
      settingsApi.toggleAppConnection(id, connect),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["apps"], data);
      showToast(`App ${variables.connect ? 'connected' : 'disconnected'} successfully`);
    },
    onError: () => {
      showToast("Failed to update connection", "error");
    }
  });

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Connected Apps</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage third-party applications connected to your account.
        </p>
      </div>

      <div className="space-y-4 max-w-3xl">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
            ))}
          </div>
        ) : (
          apps.map((app) => {
            const isConnected = !!app.connectedAt;
            
            return (
              <div key={app.id} className="bg-white dark:bg-gray-800/50 p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center shrink-0">
                    <img src={app.icon} alt={app.name} className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {app.name}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {app.permissions.map(p => (
                        <span key={p} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md">
                          {p}
                        </span>
                      ))}
                    </div>
                    {isConnected && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Connected on {new Date(app.connectedAt!).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleMutation.mutate({ id: app.id, connect: !isConnected })}
                  disabled={toggleMutation.isPending && toggleMutation.variables?.id === app.id}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2 ${
                    isConnected
                      ? "bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-red-500/10 dark:hover:text-red-500"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {toggleMutation.isPending && toggleMutation.variables?.id === app.id ? (
                    "Updating..."
                  ) : isConnected ? (
                    <>Disconnect <X className="w-4 h-4" /></>
                  ) : (
                    <>Connect <Check className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
