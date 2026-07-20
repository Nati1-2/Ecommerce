"use client";

import { useNotificationStore } from "@/store/notificationStore";
import { CheckCheck, Settings } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onOpenSettings: () => void;
}

export default function NotificationHeader({ onOpenSettings }: Props) {
  const { unreadCount, markAllAsRead, notifications } = useNotificationStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-primary-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full"
            >
              {unreadCount} unread
            </motion.span>
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Stay updated with your orders, offers, and account activity
        </p>
      </div>

      <div className="flex items-center gap-3">
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
        <button
          onClick={onOpenSettings}
          className="inline-flex items-center justify-center p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
