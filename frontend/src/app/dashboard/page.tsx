"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDashboardStore } from "@/store/dashboardStore";
import { useWishlistStore } from "@/store/wishlist";
import { useAuthStore } from "@/store/auth";

import DashboardSidebar, { DashboardTab } from "@/components/Dashboard/DashboardSidebar";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import StatsCard from "@/components/Dashboard/StatsCard";
import RecentOrders from "@/components/Dashboard/RecentOrders";
import OrderChart from "@/components/Dashboard/OrderChart";
import RecommendationCarousel from "@/components/Dashboard/RecommendationCarousel";
import RecentlyViewed from "@/components/Dashboard/RecentlyViewed";
import NotificationPreview from "@/components/Dashboard/NotificationPreview";
import SecurityCard from "@/components/Dashboard/SecurityCard";
import AddressPreview from "@/components/Dashboard/AddressPreview";
import DashboardSkeleton from "@/components/Dashboard/DashboardSkeleton";

import DashboardWishlist from "@/components/Dashboard/DashboardWishlist";
import DashboardAddresses from "@/components/Dashboard/DashboardAddresses";
import DashboardPayments from "@/components/Dashboard/DashboardPayments";
import DashboardReviews from "@/components/Dashboard/DashboardReviews";
import DashboardNotifications from "@/components/Dashboard/DashboardNotifications";
import DashboardSettings from "@/components/Dashboard/DashboardSettings";

import { motion, AnimatePresence } from "framer-motion";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get("tab") as DashboardTab | null;

  const { user: authUser, isAuthenticated, accessToken, logout, setAuth } = useAuthStore();
  const { updateProfile } = useDashboardStore();
  const [activeTab, setActiveTab] = useState<DashboardTab>(tabQuery || "profile");
  const [mounted, setMounted] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (tabQuery) {
      setActiveTab(tabQuery);
    }
  }, [tabQuery]);

  useEffect(() => {
    setMounted(true);

    const token = accessToken || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);

    if (!isAuthenticated && !token) {
      router.push("/login");
      return;
    }

    // Sync wishlist count from wishlist store
    try {
      const wishlistCount = useWishlistStore.getState().items.length;
      useDashboardStore.setState({ wishlistCount });
    } catch (e) {
      console.warn("Wishlist count sync failed:", e);
    }

    // Fetch user profile from database endpoint
    if (token) {
      fetch("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Profile fetch failed: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (data.user) {
            updateProfile({
              id: data.user.id,
              name: data.user.name || data.user.email.split("@")[0],
              email: data.user.email,
              avatar: data.user.avatar || "",
              phone: data.user.phone || "",
              membership: data.user.membership || "Standard Member ⭐",
              points: data.user.points ?? 120,
            });

            useDashboardStore.setState({
              reviewsCount: data.user.reviewsCount ?? 0,
            });

            setAuth(
              {
                id: data.user.id,
                email: data.user.email,
                role: data.user.role,
                name: data.user.name,
              } as any,
              token
            );

            // Fetch user orders
            fetch(`/api/orders?userId=${data.user.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((res) => res.json())
              .then((ordersData) => {
                const list = Array.isArray(ordersData)
                  ? ordersData
                  : (ordersData.success && Array.isArray(ordersData.data))
                    ? ordersData.data
                    : [];

                const mappedOrders = list.map((o: any) => ({
                  id: o.orderId || o._id,
                  status: o.status || "Processing",
                  amount: o.pricing?.total || o.totalAmount || o.amount || 0,
                  date: new Date(o.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                  itemsCount: o.items?.length || 1,
                }));
                useDashboardStore.setState({ orders: mappedOrders });
              })
              .catch((err) => console.warn("Dashboard orders fetch notice:", err));

            setProfileLoaded(true);
          }
        })
        .catch((err) => {
          console.warn("Profile load notice:", err.message);
          if (authUser) {
            updateProfile({
              id: authUser.id,
              name: (authUser as any).name || authUser.email?.split("@")[0] || "User",
              email: authUser.email,
              avatar: "",
              phone: "",
              membership: "Standard Member ⭐",
              points: 100,
            });
          }
          setProfileLoaded(true);
        });
    } else if (authUser) {
      updateProfile({
        id: authUser.id,
        name: (authUser as any).name || authUser.email?.split("@")[0] || "User",
        email: authUser.email,
        avatar: "",
        phone: "",
        membership: "Standard Member ⭐",
        points: 100,
      });
      setProfileLoaded(true);
    } else {
      setProfileLoaded(true);
    }
  }, []);

  const handleLogout = () => {
    logout();
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    router.push("/login");
  };

  if (!mounted || !profileLoaded) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 min-[400px]:px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar navigation */}
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            router.push(`/dashboard?tab=${tab}`);
          }}
          onLogout={handleLogout}
        />

        {/* Main content */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            {/* ── PROFILE OVERVIEW TAB ─── */}
            {activeTab === "profile" && (
              <motion.div
                key="profile-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <DashboardHeader onEditProfile={() => setActiveTab("settings")} />
                <StatsCard />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2 space-y-6">
                    <OrderChart />
                    <RecentOrders onViewAll={() => setActiveTab("orders")} />
                  </div>

                  <div className="space-y-6">
                    <SecurityCard onManage={() => setActiveTab("settings")} />
                    <AddressPreview onManage={() => setActiveTab("addresses")} />
                    <NotificationPreview />
                    <RecentlyViewed />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <RecommendationCarousel />
                </div>
              </motion.div>
            )}

            {/* ── ORDERS TAB ─────────────── */}
            {activeTab === "orders" && (
              <motion.div
                key="orders-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <RecentOrders onViewAll={undefined} />
              </motion.div>
            )}

            {/* ── WISHLIST TAB ────────────── */}
            {activeTab === "wishlist" && (
              <motion.div
                key="wishlist-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DashboardWishlist />
              </motion.div>
            )}

            {/* ── ADDRESSES TAB ───────────── */}
            {activeTab === "addresses" && (
              <motion.div
                key="addresses-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DashboardAddresses />
              </motion.div>
            )}

            {/* ── PAYMENTS & STRIPE TAB ────── */}
            {activeTab === "payments" && (
              <motion.div
                key="payments-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DashboardPayments />
              </motion.div>
            )}

            {/* ── REVIEWS TAB ─────────────── */}
            {activeTab === "reviews" && (
              <motion.div
                key="reviews-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DashboardReviews />
              </motion.div>
            )}

            {/* ── NOTIFICATIONS TAB ───────── */}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DashboardNotifications />
              </motion.div>
            )}

            {/* ── SETTINGS TAB ────────────── */}
            {activeTab === "settings" && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DashboardSettings />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
