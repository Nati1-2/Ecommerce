"use client";

import React from "react";
import { UserClickEvent } from "@/types/userActivity";
import {
  MousePointer,
  Crosshair,
  User,
  Monitor,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  Layers,
  Eye,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";

interface UserActivityTableProps {
  clicks: UserClickEvent[];
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onSelectClick: (click: UserClickEvent) => void;
}

export const UserActivityTable: React.FC<UserActivityTableProps> = ({
  clicks,
  isLoading,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  onSelectClick,
}) => {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "ADD_TO_CART_CLICK":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CHECKOUT_CLICK":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "DONATE_CLICK":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "SEARCH_SUBMIT":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "BUTTON_CLICK":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "LINK_CLICK":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "NAV_CLICK":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "FORM_SUBMIT":
        return "bg-violet-50 text-violet-700 border-violet-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "VENDOR":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CUSTOMER":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Mobile":
        return <Smartphone className="w-3.5 h-3.5 text-indigo-500" />;
      case "Tablet":
        return <Tablet className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Laptop className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    try {
      const diffMs = Date.now() - new Date(timestamp).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 5) return "Just now";
      if (diffSec < 60) return `${diffSec}s ago`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return new Date(timestamp).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-violet-50 text-violet-600 border border-violet-100">
            <MousePointer className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Live Clickstream & Interactivity Feed
            </h3>
            <p className="text-xs text-slate-500">
              Recording every user tap, button press, CTA action, and element navigation across all sessions.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{clicks.length}</strong> of <strong>{totalCount.toLocaleString()}</strong> events
        </div>
      </div>

      {/* Content State: Loading, Empty, or Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm">Fetching real-time clickstream events...</p>
        </div>
      ) : clicks.length === 0 ? (
        <div className="py-16 text-center px-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">No Click Activity Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No events match the selected filters. Try adjusting search queries, selecting &ldquo;All Actions&rdquo;, or generating test clicks.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Action & Target</th>
                <th className="py-3 px-4">Page Route</th>
                <th className="py-3 px-4">User / Actor</th>
                <th className="py-3 px-4">Device & IP</th>
                <th className="py-3 px-4">Coordinates</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {clicks.map((event) => (
                <tr
                  key={event.id}
                  onClick={() => onSelectClick(event)}
                  className="hover:bg-violet-50/30 transition-colors cursor-pointer group"
                >
                  {/* Action & Target */}
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-2.5">
                      <div className="shrink-0 mt-0.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border block ${getBadgeColor(
                            event.eventType
                          )}`}
                        >
                          {event.eventType.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <div className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors truncate">
                          &ldquo;{event.elementText}&rdquo;
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 font-mono">
                          <span>&lt;{event.targetTag.toLowerCase()}&gt;</span>
                          {event.componentName && (
                            <span className="text-slate-500 font-sans truncate">
                              • {event.componentName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Page Route */}
                  <td className="py-3 px-4 font-mono text-slate-700 max-w-[150px] truncate">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {event.path}
                    </span>
                  </td>

                  {/* User / Actor */}
                  <td className="py-3 px-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800 truncate">
                          {event.user.name}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getRoleBadge(
                            event.user.role
                          )}`}
                        >
                          {event.user.role}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono truncate block">
                        {event.user.email}
                      </span>
                    </div>
                  </td>

                  {/* Device & IP */}
                  <td className="py-3 px-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        {getDeviceIcon(event.device.type)}
                        <span className="font-medium text-slate-800 truncate">
                          {event.device.model}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <span>{event.location.flag}</span>
                        <span className="font-mono text-slate-600">{event.ip}</span>
                        <span className="text-slate-400 truncate">({event.location.city})</span>
                      </div>
                    </div>
                  </td>

                  {/* Coordinates */}
                  <td className="py-3 px-4 font-mono text-violet-700">
                    <span className="bg-violet-50 px-2 py-0.5 rounded border border-violet-100 font-semibold text-[11px]">
                      {event.coordinates.x}, {event.coordinates.y}
                    </span>
                  </td>

                  {/* Timestamp */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-medium text-slate-700 block">
                      {formatRelativeTime(event.timestamp)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(event.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </td>

                  {/* Inspect Button */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectClick(event);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-violet-100 text-slate-700 hover:text-violet-700 font-medium text-[11px] transition-colors"
                      title="Inspect event details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-slate-500">
          Page <strong>{currentPage}</strong> of <strong>{totalPages || 1}</strong> ({totalCount.toLocaleString()} total clicks recorded)
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1 || isLoading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-slate-700 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages || isLoading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-slate-700 transition-colors"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
