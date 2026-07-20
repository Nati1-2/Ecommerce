"use client";

import { useEffect, useState } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import { Notification } from "@/types";
import NotificationHeader from "@/components/Notifications/NotificationHeader";
import NotificationTabs from "@/components/Notifications/NotificationTabs";
import NotificationList from "@/components/Notifications/NotificationList";
import NotificationSearch from "@/components/Notifications/NotificationSearch";
import NotificationFilters from "@/components/Notifications/NotificationFilters";
import NotificationSettings from "@/components/Notifications/NotificationSettings";
import NotificationModal from "@/components/Notifications/NotificationModal";
import { AnimatePresence } from "framer-motion";

export default function NotificationsPage() {
  const { initialize, receiveNotification, error } = useNotificationStore();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initialize();

    // Mock Real-time Socket.IO Connection Event
    const timer = setTimeout(() => {
      // Simulate receiving a real-time notification after 5 seconds
      receiveNotification({
        id: `notif-${Date.now()}`,
        type: "PROMOTION",
        title: "Exclusive Flash Sale!",
        message: "Your favorite items are now 30% off. Limited time only, click to view offers.",
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: "/products",
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [initialize, receiveNotification]);

  if (!mounted) return null;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] pt-24 pb-12 flex flex-col items-center justify-center px-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Unable to load notifications</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => initialize()}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] pt-24 pb-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <NotificationHeader onOpenSettings={() => setShowSettings(true)} />

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <NotificationSearch />
          </div>
          <NotificationFilters />
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <NotificationTabs />
          <NotificationList onNotificationClick={setSelectedNotification} />
        </div>
      </div>

      <AnimatePresence>
        {selectedNotification && (
          <NotificationModal
            notification={selectedNotification}
            onClose={() => setSelectedNotification(null)}
          />
        )}
        {showSettings && (
          <NotificationSettings onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
