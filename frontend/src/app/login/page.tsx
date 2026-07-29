"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { LogIn, UserPlus, Lock, Mail, User, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle, Shield, Store, UserCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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


  const redirectByRole = (userRole: "CUSTOMER" | "ADMIN" | "VENDOR") => {
    if (userRole === "ADMIN") {
      router.push("/admin/dashboard");
    } else if (userRole === "VENDOR") {
      router.push("/vendor/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const handleDemoFill = (type: "customer" | "admin" | "vendor", fillOnly: boolean = false) => {
    setError("");
    setSuccess("");

    let demoEmail = "";
    let demoName = "";
    let demoRole: "CUSTOMER" | "ADMIN" | "VENDOR" = "CUSTOMER";
    let demoPass = "";

    if (type === "customer") {
      demoEmail = "john.smith@gmail.com";
      demoName = "John Smith";
      demoRole = "CUSTOMER";
      demoPass = "password123";
    } else if (type === "admin") {
      demoEmail = "admin@natistore.com";
      demoName = "Nati SuperAdmin";
      demoRole = "ADMIN";
      demoPass = "admin123";
    } else if (type === "vendor") {
      demoEmail = "vendor@natistore.com";
      demoName = "Apex Tech Wearables Store";
      demoRole = "VENDOR";
      demoPass = "vendor123";
    }

    setEmail(demoEmail);
    setPassword(demoPass);
    setRole(demoRole);
    if (isRegistering) setName(demoName);

    if (fillOnly) {
      setSuccess(`Autofilled credentials for ${demoName} (${demoRole}). Click submit to test backend authentication!`);
      return;
    }

    // Direct Instant Demo Login option: log in immediately with demo session
    const dummyUser = {
      id: "demo-" + type + "-" + Math.floor(1000 + Math.random() * 9000),
      email: demoEmail,
      name: demoName,
      role: demoRole,
    };
    const demoToken = "demo-jwt-token-" + Math.random().toString(36).substring(2);
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", demoToken);
    }
    setAuth(dummyUser, demoToken);
    setSuccess(`Demo session active as ${demoRole}! Redirecting...`);
    setTimeout(() => {
      redirectByRole(demoRole);
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegistering 
        ? { name, email, password, role } 
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please check your credentials.");
      }

      // Store in Zustand & LocalStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.token);
      }
      setAuth(data.user, data.token);
      setSuccess(`Authenticated as ${data.user.role}! Redirecting...`);

      setTimeout(() => {
        redirectByRole(data.user.role);
      }, 600);
    } catch (err: any) {
      // Connect backend login/register strictly — display real backend errors
      setError(err.message || "Failed to authenticate with backend service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-gray-50 via-white to-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Ambient background glow blur effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-3 text-center">
        <Link href="/" className="inline-flex items-center gap-1.5 text-3xl font-black text-gray-900 tracking-tight hover:opacity-90 transition-opacity">
          Nati<span className="text-[#007BFF]">.</span>
        </Link>
        
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {isRegistering ? "Create Your Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {isRegistering 
              ? "Join Nati Store for exclusive deals & instant checkout" 
              : "Sign in to access your orders, wishlist & profile"}
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-xl py-8 px-6 shadow-xl shadow-gray-200/50 rounded-3xl sm:px-10 border border-gray-100/80">
          
          {/* Segmented Tab Switcher */}
          <div className="flex bg-gray-100/80 p-1 rounded-2xl mb-6 border border-gray-200/50">
            <button
              type="button"
              onClick={() => { setIsRegistering(false); setError(""); setSuccess(""); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                !isRegistering 
                  ? "bg-white text-gray-900 shadow-sm shadow-gray-300/40" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegistering(true); setError(""); setSuccess(""); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                isRegistering 
                  ? "bg-white text-gray-900 shadow-sm shadow-gray-300/40" 
                  : "text-gray-500 hover:text-gray-900"
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
                  className="space-y-4"
                >
                  <div>
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 text-gray-900 rounded-xl text-xs font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all"
                        placeholder="John Smith"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Account Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole("CUSTOMER")}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          role === "CUSTOMER"
                            ? "border-[#007BFF] bg-blue-50/50 text-[#007BFF]"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Customer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole("VENDOR")}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          role === "VENDOR"
                            ? "border-[#007BFF] bg-blue-50/50 text-[#007BFF]"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>Seller Vendor</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 text-gray-900 rounded-xl text-xs font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                {!isRegistering && (
                  <a href="#" className="text-[11px] font-bold text-[#007BFF] hover:underline">
                    Forgot?
                  </a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50/80 border border-gray-200 text-gray-900 rounded-xl text-xs font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="••••••••"
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

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-600 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-700 text-xs font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-100"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{success}</span>
              </motion.div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-md shadow-blue-500/20 text-xs font-bold text-white bg-[#007BFF] hover:bg-blue-600 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 transition-all duration-150"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isRegistering ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account ({role})</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Account</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#007BFF]" />
                Demo Testing Options:
              </span>
              <span className="text-[10px] text-gray-400 font-normal">Click to test instantly or fill form</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleDemoFill("customer", false)}
                  className="w-full py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                  title="Instant login as Customer"
                >
                  <UserCheck className="w-3 h-3 text-blue-600" />
                  <span>Demo Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill("customer", true)}
                  className="w-full py-0.5 text-[9px] font-semibold text-gray-400 hover:text-gray-600 text-center block"
                >
                  Autofill form
                </button>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleDemoFill("vendor", false)}
                  className="w-full py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                  title="Instant login as Vendor"
                >
                  <Store className="w-3 h-3 text-emerald-600" />
                  <span>Demo Vendor</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill("vendor", true)}
                  className="w-full py-0.5 text-[9px] font-semibold text-gray-400 hover:text-gray-600 text-center block"
                >
                  Autofill form
                </button>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleDemoFill("admin", false)}
                  className="w-full py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                  title="Instant login as Admin"
                >
                  <Shield className="w-3 h-3 text-purple-600" />
                  <span>Demo Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill("admin", true)}
                  className="w-full py-0.5 text-[9px] font-semibold text-gray-400 hover:text-gray-600 text-center block"
                >
                  Autofill form
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
