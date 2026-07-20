"use client";

import { useNotificationStore } from "@/store/notificationStore";

export default function NotificationFilters() {
  const { filters, setFilter } = useNotificationStore();

  return (
    <div className="flex items-center gap-2">
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          onClick={() => setFilter({ read: null })}
          className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
            filters.read === null
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter({ read: false })}
          className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
            filters.read === false
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilter({ read: true })}
          className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
            filters.read === true
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Read
        </button>
      </div>
    </div>
  );
}
