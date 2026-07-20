"use client";

import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import { SettingsSection } from "@/types/adminSettings";
import {
  Globe,
  Users,
  Store,
  Package,
  ShoppingBag,
  CreditCard,
  Truck,
  Bell,
  ShieldCheck,
  Link,
  ToggleRight,
  Wrench,
  Database,
  Server,
  Activity,
} from "lucide-react";

export default function SettingsSidebar() {
  const { activeSection, setActiveSection } = useAdminSettingsStore();

  const sections: { id: SettingsSection; label: string; icon: any }[] = [
    { id: "general", label: "General Platform", icon: Globe },
    { id: "users", label: "Users & Accounts", icon: Users },
    { id: "vendors", label: "Vendor Marketplace", icon: Store },
    { id: "products", label: "Product Catalog", icon: Package },
    { id: "orders", label: "Orders Workflow", icon: ShoppingBag },
    { id: "payments", label: "Payment Systems", icon: CreditCard },
    { id: "shipping", label: "Shipping Logistics", icon: Truck },
    { id: "notifications", label: "Notification Gateway", icon: Bell },
    { id: "security", label: "Security Center", icon: ShieldCheck },
    { id: "integrations", label: "API Integrations", icon: Link },
    { id: "feature-flags", label: "Feature Flags", icon: ToggleRight },
    { id: "maintenance", label: "Maintenance Mode", icon: Wrench },
    { id: "cache", label: "Redis Cache Manager", icon: Server },
    { id: "database", label: "Database Backups", icon: Database },
    { id: "health", label: "System Health Mesh", icon: Activity },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-3 space-y-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
        Platform Configuration
      </p>

      {sections.map((sec) => {
        const Icon = sec.icon;
        const isSel = activeSection === sec.id;

        return (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2.5 ${
              isSel
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{sec.label}</span>
          </button>
        );
      })}
    </div>
  );
}
