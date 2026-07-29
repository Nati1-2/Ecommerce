"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { LogIn, UserPlus, Lock, Mail, User, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle, UserCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegistering
        ? { name: name.trim(), email: email.trim().toLowerCase(), password }
        : { email: email.trim().toLowerCase(), password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please check your credentials.");
      }

      // Save token
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.token);
      }

      setAuth(data.user, data.token);
      setSuccess(isRegistering ? "Account created! Redirecting to your dashboard..." : "Welcome back! Redirecting...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch (err: any) {
      setError(err.message || "Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Fill with demo customer credentials and submit to real backend
      const demoEmail = "john.smith@gmail.com";
      const demoPassword = "password123";

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: demoPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Demo login failed. Please try manual login.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.token);
      }

      setAuth(data.user, data.token);
      setSuccess("Demo customer account logged in! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch (err: any) {
      setError(err.message || "Demo login failed. Please try manually.");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (register: boolean) => {
    setIsRegistering(register);
    setError("");
    setSuccess("");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-slate-50 via-blue-50/30 to-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-400/8 rounded-full blur-3xl pointer-events-none" />

      {/* Logo + heading */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-3 text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-3xl font-black text-gray-900 tracking-tight hover:opacity-80 transition-opacity">
          Nati<span className="text-[#007BFF]">.</span>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {isRegistering ? "Create Your Account" : "Welcome Back"}
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {isRegistering
              ? "Join Nati Store — free shipping on your first order"
              : "Sign in to access your orders, wishlist & profile"}
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 shadow-xl shadow-gray-200/60 rounded-3xl sm:px-10 border border-gray-100">

          {/* Tab switcher */}
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => switchTab(false)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                !isRegistering
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchTab(true)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                isRegistering
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {isRegistering && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required={isRegistering}
                      minLength={2}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl text-xs font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all"
                      placeholder="John Smith"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl text-xs font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                {!isRegistering && (
                  <span className="text-[11px] font-semibold text-gray-400">
                    {isRegistering ? "Min 8 characters" : ""}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={isRegistering ? 8 : 1}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl text-xs font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder={isRegistering ? "Minimum 8 characters" : "••••••••"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-red-600 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-emerald-700 text-xs font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-100"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-md shadow-blue-500/20 text-xs font-bold text-white bg-[#007BFF] hover:bg-blue-600 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isRegistering ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Customer Account</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Account</span>
                </>
              )}
            </button>
          </form>

          {/* Demo login — Customer only */}
          <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-400">
              <Sparkles className="w-3.5 h-3.5 text-[#007BFF]" />
              <span>Try the demo account</span>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4 text-blue-600" />
              )}
              <span>Login as Demo Customer</span>
              <span className="text-[10px] text-blue-500 font-semibold ml-1">(john.smith@gmail.com)</span>
            </button>

            <p className="text-center text-[10px] text-gray-400 font-medium">
              New customers register above — vendors & admins contact support
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
