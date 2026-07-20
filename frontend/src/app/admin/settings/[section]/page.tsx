"use client";

import { useEffect, use } from "react";
import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import { SettingsSection } from "@/types/adminSettings";
import AdminSettingsPage from "../page";

export default function SettingsSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const resolvedParams = use(params);
  const setActiveSection = useAdminSettingsStore((state) => state.setActiveSection);

  useEffect(() => {
    if (resolvedParams?.section) {
      setActiveSection(resolvedParams.section as SettingsSection);
    }
  }, [resolvedParams, setActiveSection]);

  return <AdminSettingsPage />;
}
