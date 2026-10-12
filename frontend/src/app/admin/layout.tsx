"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminDashboard/AdminSidebar";
import AdminHeader from "@/components/AdminDashboard/AdminHeader";
import AnnouncementModal from "@/components/AdminDashboard/AnnouncementModal";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { useBroadcastAnnouncement, usePlatformStats, useMarketplaceHealth } from "@/hooks/useAdminQuery";
import { useAdminRealtime } from "@/hooks/useAdminRealtime";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setTheme } = useTheme();

  // Force light mode in admin dashboard
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  const { toast, clearToast, isAnnouncementModalOpen, setIsAnnouncementModalOpen } =
    useAdminDashboardStore();

  const broadcastMutation = useBroadcastAnnouncement();
  const { data: stats } = usePlatformStats();
  const { data: health } = useMarketplaceHealth();

  // Initialize Socket.IO real-time alerts
  useAdminRealtime();

  const usersCount = stats?.users ?? 0;
  const pendingVendorsCount = health?.pendingVendors ? `${health.pendingVendors} pending` : undefined;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col lg:flex-row light">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar usersBadge={usersCount} vendorsBadge={pendingVendorsCount} />
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden shadow-2xl border-r border-slate-200"
            >
              <AdminSidebar
                isMobile
                onCloseMobile={() => setIsMobileMenuOpen(false)}
                usersBadge={usersCount}
                vendorsBadge={pendingVendorsCount}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Platform Announcement Modal */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSend={(msg) => broadcastMutation.mutate(msg)}
      />

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900/95 dark:bg-slate-800/95 text-white rounded-2xl shadow-2xl border border-slate-800 dark:border-slate-700 backdrop-blur-md"
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            <span className="text-xs font-black tracking-tight">{toast.message}</span>
            <button
              onClick={clearToast}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
