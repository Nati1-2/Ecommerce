"use client";

import { useNotificationStore } from "@/store/notificationStore";
import { NotificationType } from "@/types";
import { motion } from "framer-motion";

const tabs: { label: string; value: NotificationType | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Orders", value: "ORDER" },
  { label: "Payments", value: "PAYMENT" },
  { label: "Promotions", value: "PROMOTION" },
  { label: "Security", value: "SECURITY" },
  { label: "System", value: "SYSTEM" },
];

export default function NotificationTabs() {
  const { filters, setFilter, notifications } = useNotificationStore();

  const getCount = (type: NotificationType | "ALL") => {
    if (type === "ALL") return notifications.length;
    return notifications.filter((n) => n.type === type).length;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-200 dark:border-gray-800 mb-6">
      {tabs.map((tab) => {
        const isActive = filters.type === tab.value;
        const count = getCount(tab.value);
        
        return (
          <button
            key={tab.value}
            onClick={() => setFilter({ type: tab.value })}
            className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? "text-primary-600 dark:text-primary-400"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isActive
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {count}
            </span>

            {isActive && (
              <motion.div
                layoutId="notificationTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-500"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
