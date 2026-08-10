"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  Package,
  Tag,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
} from "lucide-react";
import { useNotificationStore, AppNotification } from "@/store/notificationStore";
import { cn } from "@/lib/utils";

interface NavbarNotificationsProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function getNotifIcon(type: string) {
  switch (type?.toUpperCase()) {
    case "ORDER":
      return <Package className="w-4 h-4 text-blue-500" />;
    case "PROMO":
      return <Tag className="w-4 h-4 text-amber-500" />;
    case "SHIPPING":
      return <Zap className="w-4 h-4 text-[#007BFF]" />;
    case "SECURITY":
      return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    default:
      return <Info className="w-4 h-4 text-[#007BFF]" />;
  }
}

function formatRelativeTime(dateStr: string) {
  if (!dateStr) return "Just now";
  const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

export default function NavbarNotifications({
  open,
  onToggle,
  onClose,
}: NavbarNotificationsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Click outside listener to close popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleItemClick = (n: AppNotification) => {
    if (!n.read) {
      markAsRead(n.id);
    }
    onClose();
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={onToggle}
        className="relative p-2 text-gray-700 hover:text-[#007BFF] transition-colors rounded-full hover:bg-blue-50 cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-[#F9FAFB]/80 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-[#111827]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-500/10 text-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#007BFF] hover:underline cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400 space-y-2">
                  <Bell className="w-8 h-8 mx-auto text-gray-300" />
                  <p className="text-xs font-semibold">No notifications right now</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.link || "/notifications"}
                    onClick={() => handleItemClick(n)}
                    className={cn(
                      "flex items-start gap-3 p-3.5 transition-colors text-left hover:bg-blue-50/50 group relative",
                      !n.read ? "bg-blue-50/30" : "bg-white"
                    )}
                  >
                    {/* Icon */}
                    <div className="w-9 h-9 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                      {getNotifIcon(n.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <p className="text-xs font-bold text-[#111827] truncate group-hover:text-[#007BFF] transition-colors">
                          {n.title}
                        </p>
                        <span className="text-[10px] text-gray-400 font-medium shrink-0">
                          {formatRelativeTime(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                        {n.message}
                      </p>
                    </div>

                    {/* Unread indicator dot */}
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#007BFF] shrink-0 mt-2" />
                    )}
                  </Link>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
              <Link
                href="/notifications"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-1 text-xs font-bold text-[#007BFF] hover:underline"
              >
                <span>View All Notifications</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
