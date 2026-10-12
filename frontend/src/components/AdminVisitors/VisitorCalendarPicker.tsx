"use client";

import { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  RotateCcw,
} from "lucide-react";
import { VisitorTimeframe } from "@/types/adminVisitors";

interface CalendarPickerProps {
  startDate?: string;
  endDate?: string;
  timeframe?: VisitorTimeframe | string;
  onSelectDateRange: (start: string | undefined, end: string | undefined, preset?: VisitorTimeframe) => void;
  onClear: () => void;
}

export default function VisitorCalendarPicker({
  startDate,
  endDate,
  timeframe,
  onSelectDateRange,
  onClear,
}: CalendarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calendar navigation state (defaults to current month)
  const [currentNavDate, setCurrentNavDate] = useState(() => {
    if (startDate) return new Date(startDate);
    return new Date();
  });

  // Local draft selection while modal is open
  const [draftStart, setDraftStart] = useState<string | undefined>(startDate);
  const [draftEnd, setDraftEnd] = useState<string | undefined>(endDate);

  // Sync draft with incoming props
  useEffect(() => {
    setDraftStart(startDate);
    setDraftEnd(endDate);
  }, [startDate, endDate]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const year = currentNavDate.getFullYear();
  const month = currentNavDate.getMonth();

  const prevMonth = () => {
    setCurrentNavDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentNavDate(new Date(year, month + 1, 1));
  };

  // Helper format YYYY-MM-DD
  const formatYMD = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Helper format human friendly
  const formatFriendly = (isoOrYmd?: string): string => {
    if (!isoOrYmd) return "";
    const [y, m, d] = isoOrYmd.split("-").map(Number);
    if (!y || !m || !d) return isoOrYmd;
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Quick Preset Handlers
  const handlePreset = (preset: "today" | "yesterday" | "7d" | "30d" | "this_month" | "last_month" | "all") => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (preset === "all") {
      setDraftStart(undefined);
      setDraftEnd(undefined);
      onSelectDateRange(undefined, undefined, "all");
      setIsOpen(false);
      return;
    }

    let start = new Date(today);
    let end = new Date(today);

    if (preset === "today") {
      // today to today
    } else if (preset === "yesterday") {
      start.setDate(today.getDate() - 1);
      end.setDate(today.getDate() - 1);
    } else if (preset === "7d") {
      start.setDate(today.getDate() - 6);
    } else if (preset === "30d") {
      start.setDate(today.getDate() - 29);
    } else if (preset === "this_month") {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (preset === "last_month") {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
    }

    const sStr = formatYMD(start);
    const eStr = formatYMD(end);
    setDraftStart(sStr);
    setDraftEnd(eStr);
    onSelectDateRange(sStr, eStr, "custom");
    setIsOpen(false);
  };

  // Handle day click on the calendar
  const handleDayClick = (dayNum: number) => {
    const clickedDateStr = formatYMD(new Date(year, month, dayNum));

    if (!draftStart || (draftStart && draftEnd)) {
      // First click or resetting range
      setDraftStart(clickedDateStr);
      setDraftEnd(undefined);
    } else {
      // Second click: completing range
      if (new Date(clickedDateStr) < new Date(draftStart)) {
        setDraftEnd(draftStart);
        setDraftStart(clickedDateStr);
      } else {
        setDraftEnd(clickedDateStr);
      }
    }
  };

  const handleApply = () => {
    if (draftStart && !draftEnd) {
      // If only one day clicked, treat range as that single day
      onSelectDateRange(draftStart, draftStart, "custom");
    } else {
      onSelectDateRange(draftStart, draftEnd, draftStart || draftEnd ? "custom" : "all");
    }
    setIsOpen(false);
  };

  // Days calculations for current month grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const todayYMD = formatYMD(new Date());

  // Determine button trigger display label
  const isCustomRange = Boolean(startDate || endDate);
  let displayLabel = "Date Filter & Calendar";
  if (isCustomRange) {
    if (startDate && endDate) {
      displayLabel = startDate === endDate ? formatFriendly(startDate) : `${formatFriendly(startDate)} – ${formatFriendly(endDate)}`;
    } else if (startDate) {
      displayLabel = `From ${formatFriendly(startDate)}`;
    } else if (endDate) {
      displayLabel = `Until ${formatFriendly(endDate)}`;
    }
  } else if (timeframe && timeframe !== "all") {
    displayLabel = `Timeframe: ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`;
  }

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 shadow-xs ${
          isCustomRange
            ? "bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-500/20"
            : "bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300"
        }`}
        title="Open interactive dates calendar"
      >
        <CalendarIcon className={`w-3.5 h-3.5 ${isCustomRange ? "text-blue-600" : "text-slate-500"}`} />
        <span className="truncate max-w-[210px]">{displayLabel}</span>
        {isCustomRange ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="p-0.5 rounded-full hover:bg-blue-200/70 text-blue-600 transition-colors"
            title="Clear date filter"
          >
            <X className="w-3 h-3" />
          </span>
        ) : (
          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-500 uppercase">
            Calendar
          </span>
        )}
      </button>

      {/* Calendar Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 z-50 w-80 sm:w-96 bg-white rounded-3xl p-5 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Popover Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 tracking-tight">Telemetry Date Calendar</h4>
                <p className="text-[10px] text-slate-400">Filter visitors by exact days or ranges</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Presets Pills */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Quick Ranges
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handlePreset("today")}
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handlePreset("yesterday")}
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Yesterday
              </button>
              <button
                type="button"
                onClick={() => handlePreset("7d")}
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => handlePreset("30d")}
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => handlePreset("this_month")}
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => handlePreset("all")}
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                All Time
              </button>
            </div>
          </div>

          {/* Month Header Navigation */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-xs font-black text-slate-900">
              {currentNavDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Row */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Calendar Month Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}

            {/* Actual day buttons */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatYMD(new Date(year, month, day));
              const isToday = dateStr === todayYMD;

              const isStart = draftStart === dateStr;
              const isEnd = draftEnd === dateStr;
              const isInRange =
                draftStart &&
                draftEnd &&
                new Date(dateStr) > new Date(draftStart) &&
                new Date(dateStr) < new Date(draftEnd);

              let buttonStyle = "hover:bg-slate-100 text-slate-700";

              if (isStart || isEnd) {
                buttonStyle = "bg-blue-600 text-white font-black shadow-xs";
              } else if (isInRange) {
                buttonStyle = "bg-blue-50 text-blue-800 font-semibold";
              }

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={`h-8 rounded-xl text-xs flex items-center justify-center transition-all relative ${buttonStyle}`}
                >
                  <span>{day}</span>
                  {isToday && !isStart && !isEnd && (
                    <span className="w-1 h-1 rounded-full bg-blue-600 absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Manual Start / End Date Inputs */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={draftStart || ""}
                onChange={(e) => setDraftStart(e.target.value || undefined)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                End Date
              </label>
              <input
                type="date"
                value={draftEnd || ""}
                onChange={(e) => setDraftEnd(e.target.value || undefined)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setDraftStart(undefined);
                setDraftEnd(undefined);
                onClear();
                setIsOpen(false);
              }}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Calendar Range</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
