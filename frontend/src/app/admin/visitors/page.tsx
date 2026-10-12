"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useAdminVisitors } from "@/hooks/useAdminVisitorsQuery";
import VisitorTrackerHeader from "@/components/AdminVisitors/VisitorTrackerHeader";
import VisitorFilterBar from "@/components/AdminVisitors/VisitorFilterBar";
import VisitorKPICards from "@/components/AdminVisitors/VisitorKPICards";
import TrafficSourceDistribution from "@/components/AdminVisitors/TrafficSourceDistribution";
import DeviceOSDistribution from "@/components/AdminVisitors/DeviceOSDistribution";
import GeoDistributionCard from "@/components/AdminVisitors/GeoDistributionCard";
import VisitorTable from "@/components/AdminVisitors/VisitorTable";
import VisitorTrackerSkeleton from "@/components/AdminVisitors/VisitorTrackerSkeleton";
import { VisitorTimeframe } from "@/types/adminVisitors";

export default function AdminVisitorTrackerPage() {
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedDevice, setSelectedDevice] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [timeframe, setTimeframe] = useState<VisitorTimeframe | string>("all");
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  // Poll every 10 seconds if auto-refresh is active
  const refetchInterval = isAutoRefresh ? 10000 : false;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminVisitors(
    {
      searchQuery,
      sourceType: selectedSource,
      deviceType: selectedDevice,
      status: selectedStatus,
      country: selectedCountry,
      timeframe,
      startDate,
      endDate,
      page: currentPage,
      limit: 25,
    },
    refetchInterval
  );

  // Date range handler from Calendar Picker or header presets
  const handleSelectDateRange = (
    start: string | undefined,
    end: string | undefined,
    preset?: VisitorTimeframe
  ) => {
    setStartDate(start);
    setEndDate(end);
    if (preset) {
      setTimeframe(preset);
    } else if (start || end) {
      setTimeframe("custom");
    } else {
      setTimeframe("all");
    }
    setCurrentPage(1);
  };

  // Reset all filters
  const handleResetAllFilters = () => {
    setSearchQuery("");
    setSelectedSource("all");
    setSelectedDevice("all");
    setSelectedStatus("all");
    setSelectedCountry("all");
    setStartDate(undefined);
    setEndDate(undefined);
    setTimeframe("all");
    setCurrentPage(1);
  };

  if (isLoading) {
    return <VisitorTrackerSkeleton />;
  }

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900">
          Unable to Connect to Visitor Telemetry Feed
        </h3>
        <p className="text-xs text-rose-600">
          {(error as Error)?.message ||
            "Failed to load web visitor logs. Please verify your admin session credentials or network connectivity."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const stats = data?.stats || {
    totalVisits: 0,
    liveActive: 0,
    uniqueIps: 0,
    topSource: { type: "Direct" as const, name: "Direct Access", percentage: 0 },
    deviceBreakdown: [],
    sourceBreakdown: [],
    osBreakdown: [],
    topCountries: [],
  };

  const visitors = data?.visitors || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header with Real-time DB Controls & Quick Calendar Trigger */}
      <VisitorTrackerHeader
        isAutoRefresh={isAutoRefresh}
        onToggleAutoRefresh={() => setIsAutoRefresh((prev) => !prev)}
        onManualRefresh={() => refetch()}
        isFetching={isFetching}
        visitors={visitors}
        liveCount={stats.liveActive}
        timeframe={timeframe}
        onTimeframeChange={(tf) => {
          handleSelectDateRange(undefined, undefined, tf);
        }}
        startDate={startDate}
        endDate={endDate}
        onSelectDateRange={handleSelectDateRange}
      />

      {/* Advanced Filter Bar: "+ Add Filter" & Interactive Date Calendar */}
      <VisitorFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        selectedSource={selectedSource}
        onSelectSource={(s) => {
          setSelectedSource(s);
          setCurrentPage(1);
        }}
        selectedDevice={selectedDevice}
        onSelectDevice={(d) => {
          setSelectedDevice(d);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onSelectStatus={(status) => {
          setSelectedStatus(status);
          setCurrentPage(1);
        }}
        selectedCountry={selectedCountry}
        onSelectCountry={(country) => {
          setSelectedCountry(country);
          setCurrentPage(1);
        }}
        startDate={startDate}
        endDate={endDate}
        timeframe={timeframe}
        onSelectDateRange={handleSelectDateRange}
        onResetAllFilters={handleResetAllFilters}
        totalFilteredCount={totalCount}
        availableCountries={stats.topCountries}
      />

      {/* Real-time KPI Metric Summary */}
      <VisitorKPICards stats={stats} />

      {/* Traffic Acquisition Channel Breakdown */}
      <TrafficSourceDistribution
        stats={stats}
        selectedSource={selectedSource}
        onSelectSource={(source) => {
          setSelectedSource(source);
          setCurrentPage(1);
        }}
      />

      {/* Hardware & Operating System Profiling */}
      <DeviceOSDistribution
        stats={stats}
        selectedDevice={selectedDevice}
        onSelectDevice={(device) => {
          setSelectedDevice(device);
          setCurrentPage(1);
        }}
      />

      {/* Global Geolocation Origins */}
      <GeoDistributionCard
        stats={stats}
        onFilterCountry={(country) => {
          setSelectedCountry(country);
          setCurrentPage(1);
        }}
      />

      {/* Live Stream Telemetry Data Table */}
      <VisitorTable
        visitors={visitors}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        selectedSource={selectedSource}
        onSelectSource={(s) => {
          setSelectedSource(s);
          setCurrentPage(1);
        }}
        selectedDevice={selectedDevice}
        onSelectDevice={(d) => {
          setSelectedDevice(d);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onSelectStatus={(status) => {
          setSelectedStatus(status);
          setCurrentPage(1);
        }}
        selectedCountry={selectedCountry}
        onSelectCountry={(country) => {
          setSelectedCountry(country);
          setCurrentPage(1);
        }}
        timeframe={timeframe}
        onTimeframeChange={(tf) => {
          handleSelectDateRange(undefined, undefined, tf);
        }}
        startDate={startDate}
        endDate={endDate}
        onResetFilters={handleResetAllFilters}
      />
    </div>
  );
}
