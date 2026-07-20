"use client";

import { useAdminAuditStore } from "@/store/adminAuditStore";
import { Search, Filter, RotateCcw } from "lucide-react";

export default function AuditFilters() {
  const {
    filters,
    setSearchQuery,
    setEventTypeFilter,
    setRoleFilter,
    setSeverityFilter,
    setDateRangeFilter,
    resetFilters,
  } = useAdminAuditStore();

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search OpenSearch syntax: user=admin AND action=DELETE or IP address 192.168.1.105..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Event Type Filter */}
          <select
            value={filters.eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 font-semibold outline-none"
          >
            <option value="All">All Event Types</option>
            <option value="Login">Login / Auth</option>
            <option value="Create">Create Action</option>
            <option value="Update">Update Action</option>
            <option value="Delete">Delete Action</option>
            <option value="Permission Change">Permission Change</option>
            <option value="Payment Action">Payment Action</option>
            <option value="Security Event">Security Event</option>
          </select>

          {/* User Role Filter */}
          <select
            value={filters.roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 font-semibold outline-none"
          >
            <option value="All">All User Roles</option>
            <option value="Admin">Admin</option>
            <option value="Vendor">Vendor</option>
            <option value="Customer">Customer</option>
            <option value="System">System Microservice</option>
          </select>

          {/* Severity Filter */}
          <select
            value={filters.severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 font-semibold outline-none"
          >
            <option value="All">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          {/* Date Range Filter */}
          <select
            value={filters.dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 font-semibold outline-none"
          >
            <option value="Today">Today (24h)</option>
            <option value="Week">Last 7 Days</option>
            <option value="Month">Last 30 Days</option>
            <option value="Custom">Custom Range</option>
          </select>

          <button
            onClick={resetFilters}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
