"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useDashboardStore } from "@/store/dashboardStore";
import { User, Lock, ShieldCheck, Check, Loader2, Save, Bell } from "lucide-react";

export default function DashboardSettings() {
  const { user: authUser, setAuth, accessToken } = useAuthStore();
  const { user: profile, updateProfile } = useDashboardStore();

  // Profile Form State
  const [name, setName] = useState(profile.name || authUser?.email?.split("@")[0] || "");
  const [email, setEmail] = useState(profile.email || authUser?.email || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [avatar, setAvatar] = useState(profile.avatar || "");
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Notification Preferences State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(false);

  useEffect(() => {
    if (profile.name) setName(profile.name);
    if (profile.email) setEmail(profile.email);
    if (profile.phone) setPhone(profile.phone);
    if (profile.avatar) setAvatar(profile.avatar);
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSubmitting(true);
    setProfileError("");
    setProfileSuccess(false);

    try {
      const token = accessToken || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name, phone, avatar }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        updateProfile({
          name: data.user.name,
          phone: data.user.phone,
          avatar: data.user.avatar,
        });

        if (authUser) {
          setAuth(
            {
              ...authUser,
              name: data.user.name,
            },
            token || ""
          );
        }

        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      } else {
        setProfileError(data.error || "Failed to update profile");
      }
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile");
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSubmitting(true);
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      setPasswordSubmitting(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      setPasswordSubmitting(false);
      return;
    }

    try {
      const token = accessToken || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);
      const res = await fetch("/api/users/security", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(data.error || "Failed to update password");
      }
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* ── PERSONAL PROFILE SECTION ─────────────────────────────── */}
      <div className="p-6 border border-gray-100 bg-white rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#007BFF]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900">Personal Information</h2>
            <p className="text-[11px] text-gray-400 font-semibold">
              Update your account details and public avatar URL
            </p>
          </div>
        </div>

        {profileSuccess && (
          <div className="p-3.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            Profile details saved successfully to database!
          </div>
        )}

        {profileError && (
          <div className="p-3.5 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-xs font-semibold">
            {profileError}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-gray-400 rounded-xl text-xs font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                Avatar Image URL
              </label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileSubmitting}
              className="py-3 px-6 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/15 flex items-center gap-2 transition-all"
            >
              {profileSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── SECURITY & PASSWORD SECTION ───────────────────────────── */}
      <div className="p-6 border border-gray-100 bg-white rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900">Security & Password</h2>
            <p className="text-[11px] text-gray-400 font-semibold">
              Change your password and manage account security
            </p>
          </div>
        </div>

        {passwordSuccess && (
          <div className="p-3.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            Password updated securely in database!
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-xs font-semibold">
            {passwordError}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordSubmitting}
              className="py-3 px-6 bg-gray-900 hover:bg-black disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
            >
              {passwordSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── NOTIFICATION PREFERENCES ─────────────────────────────── */}
      <div className="p-6 border border-gray-100 bg-white rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900">Notification Preferences</h2>
            <p className="text-[11px] text-gray-400 font-semibold">
              Choose how you want to be notified about your orders and offers
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div>
              <h4 className="text-xs font-black text-gray-900">Email Order Updates</h4>
              <p className="text-[11px] text-gray-500 font-medium">Receive tracking & status changes via email</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-[#007BFF] focus:ring-[#007BFF]"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div>
              <h4 className="text-xs font-black text-gray-900">SMS Delivery Alerts</h4>
              <p className="text-[11px] text-gray-500 font-medium">Get SMS notifications when package is out for delivery</p>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-[#007BFF] focus:ring-[#007BFF]"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div>
              <h4 className="text-xs font-black text-gray-900">Promotions & Flash Sales</h4>
              <p className="text-[11px] text-gray-500 font-medium">Receive exclusive member coupons and flash sale invites</p>
            </div>
            <input
              type="checkbox"
              checked={promoAlerts}
              onChange={(e) => setPromoAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-[#007BFF] focus:ring-[#007BFF]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
