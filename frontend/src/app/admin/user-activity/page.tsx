"use client";

import React, { useState } from "react";
import {
  MousePointer,
  RefreshCw,
  Radio,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useUserActivity, useSimulateUserClick } from "@/hooks/useUserActivityQuery";
import { UserClickEvent } from "@/types/userActivity";
import UserActivityKPIs from "@/components/AdminUserActivity/UserActivityKPIs";
import UserActivityFilterBar from "@/components/AdminUserActivity/UserActivityFilterBar";
import { ClickHotspotsCard } from "@/components/AdminUserActivity/ClickHotspotsCard";
import { UserActivityTable } from "@/components/AdminUserActivity/UserActivityTable";
import { ClickDetailModal } from "@/components/AdminUserActivity/ClickDetailModal";

export default function AdminUserActivityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [page, setPage] = useState(1);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [selectedClick, setSelectedClick] = useState<UserClickEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Poll every 3s if auto refresh active
  const refetchInterval = isAutoRefresh ? 3000 : false;

  const { data, isLoading, isError, error, refetch, isFetching } = useUserActivity(
    {
      search: searchQuery,
      eventType: selectedEventType,
      role: selectedRole,
      page,
      limit: 25,
    },
    refetchInterval
  );

  const simulateMutation = useSimulateUserClick();

  const handleSimulate = async () => {
    try {
      await simulateMutation.mutateAsync();
      setToastMessage("⚡ Synthetic User Click successfully recorded into live clickstream!");
      setTimeout(() => setToastMessage(null), 3500);
    } catch {
      setToastMessage("Failed to simulate click event.");
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleHotspotFilter = (text: string) => {
    setSearchQuery(text);
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleEventTypeChange = (type: string) => {
    setSelectedEventType(type);
    setPage(1);
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setPage(1);
  };

  const stats = data?.stats || {
    totalClicksToday: 0,
    activeClickersCount: 0,
    clicksPerMinute: 0,
    topClickedElement: "None",
    topClickedCategory: "None",
    customerClicksShare: 0,
    guestClicksShare: 0,
    vendorClicksShare: 0,
    adminClicksShare: 0,
    hotspots: [],
  };

  const clicks = data?.clicks || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-200">
              <MousePointer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  User Clickstream & Activity Logger
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-800 border border-violet-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
                  Live Recorder
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real-time per-click telemetry recording every button tap, CTA link, checkout step, and search query across Customers, Guests, Vendors, and Admins.
              </p>
            </div>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
            title="Refresh clickstream manually"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-violet-600" : ""}`} />
            <span>{isFetching ? "Syncing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Error State Banner */}
      {isError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>
              Failed to load real-time user activity logs:{" "}
              {error instanceof Error ? error.message : "Network error"}
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* 1. KPIs Metrics */}
      <UserActivityKPIs stats={stats} />

      {/* 2. Filter Bar */}
      <UserActivityFilterBar
        searchQuery={searchQuery}
        selectedEventType={selectedEventType}
        selectedRole={selectedRole}
        isAutoRefresh={isAutoRefresh}
        isSimulating={simulateMutation.isPending}
        onSearchChange={handleSearchChange}
        onEventTypeChange={handleEventTypeChange}
        onRoleChange={handleRoleChange}
        onToggleAutoRefresh={() => setIsAutoRefresh(!isAutoRefresh)}
        onSimulateClick={handleSimulate}
      />

      {/* 3. Hotspots Card */}
      <ClickHotspotsCard
        hotspots={stats.hotspots || []}
        totalClicksToday={stats.totalClicksToday}
        onFilterHotspot={handleHotspotFilter}
      />

      {/* 4. Live Clickstream Table */}
      <UserActivityTable
        clicks={clicks}
        isLoading={isLoading}
        totalCount={totalCount}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onSelectClick={setSelectedClick}
      />

      {/* 5. Click Detail Modal */}
      <ClickDetailModal
        click={selectedClick}
        onClose={() => setSelectedClick(null)}
      />
    </div>
  );
}
