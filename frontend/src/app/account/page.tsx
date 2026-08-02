"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Home, ShoppingBag, Heart, LogOut, User } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

import ProfileSidebar, { ProfileTab } from "@/components/Profile/ProfileSidebar";
import ProfileSkeleton from "@/components/Profile/ProfileSkeleton";

import { useAuthStore } from "@/store/auth";
import { useProfileStore } from "@/store/profileStore";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import heavy profile/dashboard components to avoid SSR crashes
const ProfileHeader = dynamic(() => import("@/components/Profile/ProfileHeader"), { ssr: false });
const PersonalInfoForm = dynamic(() => import("@/components/Profile/PersonalInfoForm"), { ssr: false });
const EmailVerification = dynamic(() => import("@/components/Profile/EmailVerification"), { ssr: false });
const PhoneVerification = dynamic(() => import("@/components/Profile/PhoneVerification"), { ssr: false });
const PasswordForm = dynamic(() => import("@/components/Profile/PasswordForm"), { ssr: false });
const TwoFactorAuth = dynamic(() => import("@/components/Profile/TwoFactorAuth"), { ssr: false });
const LoginActivity = dynamic(() => import("@/components/Profile/LoginActivity"), { ssr: false });
const PrivacySettings = dynamic(() => import("@/components/Profile/PrivacySettings"), { ssr: false });
const DeleteAccount = dynamic(() => import("@/components/Profile/DeleteAccount"), { ssr: false });

const DashboardPayments = dynamic(() => import("@/components/Dashboard/DashboardPayments"), { ssr: false });
const DashboardAddresses = dynamic(() => import("@/components/Dashboard/DashboardAddresses"), { ssr: false });
const DashboardWishlist = dynamic(() => import("@/components/Dashboard/DashboardWishlist"), { ssr: false });
const DashboardNotifications = dynamic(() => import("@/components/Dashboard/DashboardNotifications"), { ssr: false });
const DashboardSettings = dynamic(() => import("@/components/Dashboard/DashboardSettings"), { ssr: false });
const RecentOrders = dynamic(() => import("@/components/Dashboard/RecentOrders"), { ssr: false });

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQuery = searchParams ? (searchParams.get("tab") as ProfileTab | null) : null;

  const [activeTab, setActiveTab] = useState<ProfileTab>(tabQuery || "overview");
  const [mounted, setMounted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Wait for Zustand persist middleware to finish hydrating from localStorage
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    // If already hydrated (e.g. fast load), check immediately
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return () => {
      unsub();
    };
  }, []);

  // Read store values after hydration
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    if (!mounted || !hydrated) return;

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
          if (data?.user) {
            const nameParts = (data.user.name || user?.name || "").trim().split(" ");
            const firstName = nameParts[0] || user?.email?.split("@")[0] || "Customer";
            const lastName = nameParts.slice(1).join(" ") || "";

            try {
              useProfileStore.getState().setUser({
                id: data.user.id || "usr-me",
                firstName,
                lastName,
                email: data.user.email || user?.email || "",
                phone: data.user.phone || "",
                role: data.user.membership || data.user.role || "Standard Member ⭐",
                verified: data.user.isVerified ?? true,
                avatar: data.user.avatar || "",
              });
            } catch (e) {
              console.warn("Profile store sync warning:", e);
            }

            if (user && data.user.name && user.name !== data.user.name) {
              setAuth({ ...user, name: data.user.name, phone: data.user.phone }, token);
            }
          }
        })
        .catch(() => {});
    }
  }, [mounted, hydrated, isAuthenticated, router]);

  useEffect(() => {
    if (tabQuery) {
      setActiveTab(tabQuery);
    }
  }, [tabQuery]);

  const handleLogout = () => {
    logout();
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    router.push("/login");
  };

  // Show skeleton until client-side hydration is complete
  if (!mounted || !hydrated || !isAuthenticated) {
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
                <RecentOrders />
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
