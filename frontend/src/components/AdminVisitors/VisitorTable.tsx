"use client";

import { useState } from "react";
import {
  Search,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  Copy,
  Check,
  Share2,
  Navigation,
  Megaphone,
} from "lucide-react";
import { VisitorLogItem, DeviceType, TrafficSourceType } from "@/types/adminVisitors";
import VisitorDetailsModal from "./VisitorDetailsModal";

interface TableProps {
  visitors: VisitorLogItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedSource: string;
  onSelectSource: (s: string) => void;
  selectedDevice: string;
  onSelectDevice: (d: string) => void;
}

export default function VisitorTable({
  visitors,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  searchQuery,
  onSearchChange,
  selectedSource,
  onSelectSource,
  selectedDevice,
  onSelectDevice,
}: TableProps) {
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorLogItem | null>(null);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  const handleCopy = (ip: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case "Mobile":
        return <Smartphone className="w-3.5 h-3.5 text-pink-600" />;
      case "Tablet":
        return <Tablet className="w-3.5 h-3.5 text-purple-600" />;
      case "Desktop":
      default:
        return <Monitor className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  const getSourceBadge = (type: TrafficSourceType, name: string) => {
    switch (type) {
      case "Search Engine":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Search className="w-3 h-3 text-blue-600" />,
        };
      case "Social Media":
        return {
          bg: "bg-pink-50 text-pink-700 border-pink-200",
          icon: <Share2 className="w-3 h-3 text-pink-600" />,
        };
      case "Direct":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <Navigation className="w-3 h-3 text-emerald-600" />,
        };
      case "Campaign / Ad":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Megaphone className="w-3 h-3 text-amber-600" />,
        };
      case "Referral":
      default:
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <ExternalLink className="w-3 h-3 text-purple-600" />,
        };
    }
  };

  const formatRelativeTime = (isoString: string) => {
    const diff = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const sourceTabs = [
    { label: "All Sources", value: "all" },
    { label: "Search Engines", value: "Search Engine" },
    { label: "Social Media", value: "Social Media" },
    { label: "Direct Traffic", value: "Direct" },
    { label: "Referrals", value: "Referral" },
    { label: "Campaigns", value: "Campaign / Ad" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-6">
      {/* Table Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Source Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {sourceTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onSelectSource(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSource.toLowerCase() === tab.value.toLowerCase()
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Device Filter */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search IP, location, path..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
            />
          </div>

          {/* Device Type Select */}
          <select
            value={selectedDevice}
            onChange={(e) => onSelectDevice(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="all">All Devices</option>
            <option value="Desktop">Desktop (PC)</option>
            <option value="Mobile">Mobile</option>
            <option value="Tablet">Tablet</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Visitor & IP</th>
              <th className="py-3 px-4">Device & OS</th>
              <th className="py-3 px-4">Acquisition Link Source</th>
              <th className="py-3 px-4">Page Visited</th>
              <th className="py-3 px-4">Time & Status</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visitors.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Search className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold text-slate-800">No matching visitors found</div>
                    <p className="text-xs text-slate-400">
                      Try clearing filters or search terms to display more session data.
                    </p>
                    {(searchQuery || selectedSource !== "all" || selectedDevice !== "all") && (
                      <button
                        onClick={() => {
                          onSearchChange("");
                          onSelectSource("all");
                          onSelectDevice("all");
                        }}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Reset all filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              visitors.map((v) => {
                const sourceBadge = getSourceBadge(v.source.type, v.source.name);
                const isOnline = v.status === "online";

                return (
                  <tr
                    key={v.id}
                    onClick={() => setSelectedVisitor(v)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    {/* Visitor & IP */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg leading-none" title={v.location?.country}>
                          {v.location?.flag || "🌐"}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-slate-900">{v.ip}</span>
                            <button
                              onClick={(e) => handleCopy(v.ip, e)}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 transition-opacity"
                              title="Copy IP"
                            >
                              {copiedIp === v.ip ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {v.location?.city ? `${v.location.city}, ` : ""}
                            {v.location?.country || "Unknown Country"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Device & OS */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          {getDeviceIcon(v.deviceType)}
                          <span className="truncate max-w-[140px]">{v.deviceModel || v.deviceType}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                            {v.os}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
                            {v.browser}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Acquisition Source */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-extrabold border ${sourceBadge.bg}`}
                        >
                          {sourceBadge.icon}
                          <span>{v.source?.type}</span>
                        </span>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1 truncate max-w-[180px]">
                          <span>{v.source?.name}</span>
                          {v.source?.referrer && v.source.referrer !== "direct" && (
                            <span
                              className="text-slate-400 text-[10px] truncate max-w-[120px]"
                              title={v.source.referrer}
                            >
                              • {v.source.referrer.replace(/^https?:\/\//, "")}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Page Visited */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg truncate max-w-[160px] inline-block">
                        {v.path}
                      </span>
                    </td>

                    {/* Time & Status */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                            }`}
                          />
                          <span>{formatRelativeTime(v.visitedAt)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {new Date(v.visitedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVisitor(v);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
        <div>
          Showing <span className="font-bold text-slate-900">{visitors.length}</span> of{" "}
          <span className="font-bold text-slate-900">{totalCount}</span> sessions
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-slate-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details Modal */}
      <VisitorDetailsModal
        visitor={selectedVisitor}
        onClose={() => setSelectedVisitor(null)}
      />
    </div>
  );
}
