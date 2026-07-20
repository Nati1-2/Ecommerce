"use client";

import { useEffect } from "react";
import { useAdminNotificationStore } from "@/store/adminNotificationStore";
import AdminNotificationsPage from "../page";

export default function CreateNotificationPage() {
  const setActiveTab = useAdminNotificationStore((state) => state.setActiveTab);

  useEffect(() => {
    setActiveTab("create");
  }, [setActiveTab]);

  return <AdminNotificationsPage />;
}
