"use client";

import { useNotificationStore } from "@/store/notificationStore";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NotificationCard from "./NotificationCard";
import { BellRing } from "lucide-react";
import { Notification } from "@/types";

interface Props {
  onNotificationClick: (notification: Notification) => void;
}

export default function NotificationList({ onNotificationClick }: Props) {
  const { notifications, filters, loading } = useNotificationStore();

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    if (filters.type !== "ALL") {
      result = result.filter((n) => n.type === filters.type);
    }

    if (filters.read !== null) {
      result = result.filter((n) => n.read === filters.read);
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
      );
    }

    return result;
  }, [notifications, filters]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-4 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827]">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredNotifications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50/50 dark:bg-[#0B0F19]/50"
      >
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <BellRing className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No notifications yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          You're all caught up! Check back later for new updates, offers, and order statuses.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {filteredNotifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onClick={onNotificationClick}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
