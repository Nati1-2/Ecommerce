"use client";

import { useEffect } from "react";
import { useAdminNotificationStore } from "@/store/adminNotificationStore";
import AdminNotificationsPage from "../page";

export default function CampaignsPage() {
  const setActiveTab = useAdminNotificationStore((state) => state.setActiveTab);

  useEffect(() => {
    setActiveTab("campaigns");
  }, [setActiveTab]);

  return <AdminNotificationsPage />;
}
