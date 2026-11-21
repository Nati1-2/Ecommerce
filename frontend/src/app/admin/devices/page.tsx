"use client";

import React, { useState } from "react";
import {
  MonitorSmartphone,
  Radio,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useAdminDevices } from "@/hooks/useAdminDevicesQuery";
import { DeviceSession } from "@/types/deviceTraffic";
import DeviceStatsCards from "@/components/AdminDevices/DeviceStatsCards";
import DeviceFilterBar from "@/components/AdminDevices/DeviceFilterBar";
import DeviceTrafficTable from "@/components/AdminDevices/DeviceTrafficTable";
import LiveActivityStream from "@/components/AdminDevices/LiveActivityStream";
import DeviceActivityModal from "@/components/AdminDevices/DeviceActivityModal";
import DeviceTrafficSkeleton from "@/components/AdminDevices/DeviceTrafficSkeleton";

export default function AdminDevicesTrafficPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeviceType, setSelectedDeviceType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"devices" | "activities">("devices");
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<DeviceSession | null>(null);

  // Poll every 5s if auto refresh active
  const refetchInterval = isAutoRefresh ? 5000 : false;

  const { data, isLoading, isError, error, refetch, isFetching } = useAdminDevices(
    {
      search: searchQuery,
      deviceType: selectedDeviceType,
      status: selectedStatus,
      category: selectedCategory,
    },
    refetchInterval
  );

  if (isLoading) {
    return <DeviceTrafficSkeleton />;
  }

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900">
          Device Telemetry Ingress Disconnected
        </h3>
        <p className="text-xs text-rose-600">
          {(error as Error)?.message || "Failed to load device traffic stream."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition-all cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const stats = data?.stats || {
    activeDevicesCount: 0,
    totalEventsToday: 0,
    mobileShare: 0,
    desktopShare: 0,
    tabletShare: 0,
    topDeviceModel: "",
    uniqueIpsCount: 0,
    avgResponseLatency: 0,
  };

  const devices = data?.devices || [];
  const allActivities = data?.allActivities || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
              <MonitorSmartphone className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Device Traffic & Activity Monitor
            </h1>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime Telemetry</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Real-time ingress monitoring client devices, IP geolocation, hardware fingerprints, and granular activity logos.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/80">
            {devices.length} Devices Monitored
          </span>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <DeviceStatsCards stats={stats} totalDevicesCount={devices.length} />

      {/* Search & Filter Toolbar */}
      <DeviceFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDeviceType={selectedDeviceType}
        setSelectedDeviceType={setSelectedDeviceType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isAutoRefresh={isAutoRefresh}
        setIsAutoRefresh={setIsAutoRefresh}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      {/* Main View: Connected Devices Table OR Activity Stream */}
      {viewMode === "devices" ? (
        <DeviceTrafficTable
          devices={devices}
          onSelectDevice={(dev) => setSelectedDevice(dev)}
        />
      ) : (
        <LiveActivityStream activities={allActivities} />
      )}

      {/* Device Activity Log Details Modal / Drawer */}
      <DeviceActivityModal
        device={selectedDevice}
        isOpen={!!selectedDevice}
        onClose={() => setSelectedDevice(null)}
      />
    </div>
  );
}
