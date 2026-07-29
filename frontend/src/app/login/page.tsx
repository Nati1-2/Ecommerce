"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { LogIn, UserPlus, Lock, Mail, User, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle, Shield, Store, UserCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const DEMO_ACCOUNTS = {
  "john.smith@gmail.com": { password: "password123", name: "John Smith", role: "CUSTOMER" as const },
  "vendor@natistore.com": { password: "vendor123", name: "Apex Tech Vendor Store", role: "VENDOR" as const },
  "admin@natistore.com": { password: "admin123", name: "Nati System Admin", role: "ADMIN" as const },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "ADMIN" | "VENDOR">("CUSTOMER");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  const handleDemoFill = (type: "customer" | "admin" | "vendor") => {
    setError("");
    setSuccess("");

    if (type === "customer") {
      setEmail("john.smith@gmail.com");
      setPassword("password123");
      setRole("CUSTOMER");
      if (isRegistering) setName("John Smith");
    } else if (type === "admin") {
      setEmail("admin@natistore.com");
      setPassword("admin123");
      setRole("ADMIN");
      if (isRegistering) setName("Nati System Admin");
    } else if (type === "vendor") {
      setEmail("vendor@natistore.com");
      setPassword("vendor123");
      setRole("VENDOR");
      if (isRegistering) setName("Apex Tech Vendor Store");
    }
  };

  const redirectByRole = (userRole: "CUSTOMER" | "ADMIN" | "VENDOR") => {
    if (userRole === "ADMIN") {
      router.push("/admin/dashboard");
    } else if (userRole === "VENDOR") {
      router.push("/vendor/dashboard");
    } else {
      router.push("/account");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const normalizedEmail = email.toLowerCase().trim();

    const demoAccount = DEMO_ACCOUNTS[normalizedEmail as keyof typeof DEMO_ACCOUNTS];
    if (demoAccount && !isRegistering) {
      if (demoAccount.password !== password) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      const demoUser = {
        id: "usr-" + Math.floor(1000 + Math.random() * 9000),
        email: normalizedEmail,
        name: demoAccount.name,
        role: demoAccount.role,
      };

      const demoToken = "demo-jwt-token-" + Math.random().toString(36).substring(2);
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", demoToken);
      }
      setAuth(demoUser, demoToken);
      setSuccess(`Signed in as ${demoAccount.role}! Redirecting...`);
      setTimeout(() => redirectByRole(demoAccount.role), 600);
      return;
    }

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegistering 
        ? { name, email: normalizedEmail, password, role } 
        : { email: normalizedEmail, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", data.token);
        }
        setAuth(data.user, data.token);
        setSuccess(`Signed in successfully as ${data.user.role}! Redirecting...`);
        setTimeout(() => redirectByRole(data.user.role), 600);
        return;
      }

      if (data.error) {
        throw new Error(data.error);
      }
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes("invalid")) {
        setError(err.message);
        setLoading(false);
        return;
      }
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none font-sans">
      {/* Premium ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#007BFF]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-4 text-center">
        <Link href="/" className="inline-flex items-center gap-1.5 text-4xl font-extrabold text-white tracking-tight hover:opacity-90 transition-opacity">
          Nati<span className="text-[#007BFF] font-black">.</span>
        </Link>
        
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isRegistering ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5">
            {isRegistering 
              ? "Join Nati Store for exclusive deals & premium shopping" 
              : "Sign in to access your dashboard, orders & wishlist"}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0C0F17]/85 backdrop-blur-2xl py-9 px-8 shadow-2xl shadow-black/80 rounded-[2rem] sm:px-10 border border-slate-800/80">
          
          {/* Segmented Tab Switcher */}
          <div className="flex bg-[#121926]/90 p-1.5 rounded-2xl mb-7 border border-slate-800/50">
            <button
              type="button"
              onClick={() => { setIsRegistering(false); setError(""); setSuccess(""); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                !isRegistering 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegistering(true); setError(""); setSuccess(""); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                isRegistering 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {isRegistering && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required={isRegistering}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#151D2F]/50 border border-slate-800 text-white rounded-xl text-xs font-medium placeholder-slate-500 focus:bg-[#151D2F]/80 focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                        placeholder="John Smith"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Account Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole("CUSTOMER")}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
                          role === "CUSTOMER"
                            ? "border-[#007BFF] bg-[#007BFF]/10 text-white"
                            : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#007BFF]" />
                        <span>Customer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole("VENDOR")}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
                          role === "VENDOR"
                            ? "border-[#007BFF] bg-[#007BFF]/10 text-white"
                            : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                        }`}
                      >
                        <Store className="w-3.5 h-3.5 text-[#007BFF]" />
                        <span>Seller Vendor</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#151D2F]/50 border border-slate-800 text-white rounded-xl text-xs font-medium placeholder-slate-500 focus:bg-[#151D2F]/80 focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                {!isRegistering && (
                  <a href="#" className="text-[10px] font-bold text-[#007BFF] uppercase hover:underline tracking-wider">
                    Forgot?
                  </a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#151D2F]/50 border border-slate-800 text-white rounded-xl text-xs font-medium placeholder-slate-500 focus:bg-[#151D2F]/80 focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-xs font-semibold bg-red-950/20 p-3.5 rounded-xl border border-red-900/50"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-400 text-xs font-semibold bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-900/50"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{success}</span>
              </motion.div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/10 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isRegistering ? (
                  <>
                    <UserPlus className="w-4.5 h-4.5" />
                    <span>Create Account ({role})</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4.5 h-4.5" />
                    <span>Sign In to Account</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#007BFF] animate-pulse" />
              <span>Fill Quick Demo Account</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleDemoFill("customer")}
                className="px-3.5 py-2 bg-[#121926]/90 hover:bg-[#172032] text-slate-300 hover:text-white border border-slate-800 rounded-xl text-[10px] font-bold transition-all duration-200 flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill("vendor")}
                className="px-3.5 py-2 bg-[#121926]/90 hover:bg-[#172032] text-slate-300 hover:text-white border border-slate-800 rounded-xl text-[10px] font-bold transition-all duration-200 flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5 text-emerald-500" />
                <span>Vendor</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill("admin")}
                className="px-3.5 py-2 bg-[#121926]/90 hover:bg-[#172032] text-slate-300 hover:text-white border border-slate-800 rounded-xl text-[10px] font-bold transition-all duration-200 flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-purple-500" />
                <span>Admin</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
