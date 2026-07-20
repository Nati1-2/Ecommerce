"use client";

import { useEffect } from "react";
import { useAdminNotificationStore } from "@/store/adminNotificationStore";
import AdminNotificationsPage from "../page";

export default function TemplatesPage() {
  const setActiveTab = useAdminNotificationStore((state) => state.setActiveTab);

  useEffect(() => {
    setActiveTab("templates");
  }, [setActiveTab]);

  return <AdminNotificationsPage />;
}
