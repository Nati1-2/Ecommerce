"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Home, ShoppingBag, Heart, LogOut, User } from "lucide-react";
import Link from "next/link";

import ProfileSidebar, { ProfileTab } from "@/components/Profile/ProfileSidebar";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import PersonalInfoForm from "@/components/Profile/PersonalInfoForm";
import EmailVerification from "@/components/Profile/EmailVerification";
import PhoneVerification from "@/components/Profile/PhoneVerification";
import PasswordForm from "@/components/Profile/PasswordForm";
import TwoFactorAuth from "@/components/Profile/TwoFactorAuth";
import LoginActivity from "@/components/Profile/LoginActivity";
import PrivacySettings from "@/components/Profile/PrivacySettings";
import DeleteAccount from "@/components/Profile/DeleteAccount";
import ProfileSkeleton from "@/components/Profile/ProfileSkeleton";

import DashboardPayments from "@/components/Dashboard/DashboardPayments";
import DashboardAddresses from "@/components/Dashboard/DashboardAddresses";
import DashboardWishlist from "@/components/Dashboard/DashboardWishlist";
import DashboardNotifications from "@/components/Dashboard/DashboardNotifications";
import DashboardSettings from "@/components/Dashboard/DashboardSettings";
import RecentOrders from "@/components/Dashboard/RecentOrders";

import { useAuthStore } from "@/store/auth";
import { motion, AnimatePresence } from "framer-motion";

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get("tab") as ProfileTab | null;

  const { user, isAuthenticated, logout, setAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>(tabQuery || "overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Sync profile data from backend server database API
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) {
      fetch("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            const nameParts = (data.user.name || user?.name || "").trim().split(" ");
            const firstName = nameParts[0] || user?.email?.split("@")[0] || "Customer";
            const lastName = nameParts.slice(1).join(" ") || "";

            useProfileStore.getState().setUser({
              id: data.user.id,
              firstName,
              lastName,
              email: data.user.email || user?.email || "",
              phone: data.user.phone || "",
              role: data.user.membership || data.user.role || "Standard Member ⭐",
              verified: data.user.isVerified ?? true,
              avatar: data.user.avatar || "",
            });

            if (user && data.user.name && user.name !== data.user.name) {
              setAuth({ ...user, name: data.user.name, phone: data.user.phone }, token);
            }
          }
        })
        .catch(console.error);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (tabQuery) {
      setActiveTab(tabQuery);
    }
  }, [tabQuery]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!mounted || !isAuthenticated) {
    return <ProfileSkeleton />;
  }

  const displayName = user?.name || (user?.email ? user.email.split("@")[0] : "Customer");

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 select-none">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <Link href="/" className="hover:text-gray-900 flex items-center gap-1 transition-colors">
          <Home className="w-3.5 h-3.5" />
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-500">My Account</span>
      </nav>

      {/* Account Header Quick Bar */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#007BFF] to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-blue-500/20">
            {user?.email ? user.email.charAt(0).toUpperCase() : <User className="w-7 h-7" />}
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900">
              Welcome Back, {displayName}
            </h1>
            <p className="text-xs text-gray-400 font-medium">{user?.email || "Logged In User"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200/80 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-[#007BFF]" />
            Order History
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200/80 transition-colors"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            Wishlist
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl border border-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left column navigation sidebar */}
        <ProfileSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            router.push(`/account?tab=${tab}`);
          }}
          onLogout={handleLogout}
        />

        {/* Right column settings panels */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <ProfileHeader />
                <PersonalInfoForm />
                <EmailVerification />
                <PhoneVerification />
              </motion.div>
            )}

            {activeTab === "personal" && (
              <motion.div
                key="personal-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <PersonalInfoForm />
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <PasswordForm />
                <TwoFactorAuth />
                <LoginActivity />
              </motion.div>
            )}

            {activeTab === "addresses" && (
              <motion.div
                key="addresses-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DashboardAddresses />
              </motion.div>
            )}

            {activeTab === "payments" && (
              <motion.div
                key="payments-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DashboardPayments />
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <RecentOrders onViewAll={undefined} />
              </motion.div>
            )}

            {activeTab === "wishlist" && (
              <motion.div
                key="wishlist-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DashboardWishlist />
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                key="notifications-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DashboardNotifications />
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <DashboardSettings />
                <PrivacySettings />
                <DeleteAccount />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <AccountContent />
    </Suspense>
  );
}
