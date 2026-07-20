"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminDashboard/AdminSidebar";
import AdminHeader from "@/components/AdminDashboard/AdminHeader";
import AnnouncementModal from "@/components/AdminDashboard/AnnouncementModal";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { useBroadcastAnnouncement } from "@/hooks/useAdminQuery";
import { useAdminRealtime } from "@/hooks/useAdminRealtime";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast, clearToast, isAnnouncementModalOpen, setIsAnnouncementModalOpen } =
    useAdminDashboardStore();

  const broadcastMutation = useBroadcastAnnouncement();

  // Initialize Socket.IO real-time alerts
  useAdminRealtime();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-100 font-sans antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
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
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-slate-950 z-50 lg:hidden shadow-2xl"
            >
              <AdminSidebar isMobile onCloseMobile={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
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
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800"
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            <span className="text-xs font-bold">{toast.message}</span>
            <button onClick={clearToast} className="p-1 text-slate-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
