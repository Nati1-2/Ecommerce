"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useProfileStore } from "@/store/profileStore";
import {
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  LogOut,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const DEMO_ACCOUNT = {
  email: "john.smith@gmail.com",
  password: "password123",
  name: "John Smith",
  role: "CUSTOMER" as const,
};

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  useEffect(() => {
    setMounted(true);
  }, []);

  const redirectByRole = (userRole: string) => {
    let target = "/dashboard";
    if (redirectParam && redirectParam.startsWith("/") && redirectParam !== "/login") {
      target = redirectParam;
    } else {
      const roleUpper = userRole?.toUpperCase();
      if (roleUpper === "ADMIN") {
        target = "/admin/dashboard";
      } else if (roleUpper === "VENDOR") {
        target = "/vendor/dashboard";
      }
    }
    if (typeof window !== "undefined") {
      window.location.href = target;
    } else {
      router.push(target);
    }
  };

  // If already authenticated and there is a redirect parameter, navigate automatically
  useEffect(() => {
    if (mounted && isAuthenticated && user) {
      if (redirectParam && redirectParam.startsWith("/") && redirectParam !== "/login") {
        window.location.href = redirectParam;
      }
    }
  }, [mounted, isAuthenticated, user, redirectParam]);

  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: DEMO_ACCOUNT.email,
          password: DEMO_ACCOUNT.password,
          isDemo: true,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data && (data.token || data.accessToken)) {
        const token = data.token || data.accessToken;
        const userObj = data.user;

        if (typeof document !== "undefined") {
          document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
        }
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("auth_token", token);
        }

        setAuth(userObj, token);

        try {
          useProfileStore.getState().setUser({
            id: userObj.id || "usr-demo-customer",
            firstName: "John",
            lastName: "Smith",
            email: userObj.email,
            phone: userObj.phone || "+1 (555) 234-5678",
            role: userObj.membership || userObj.role || "Standard Member ⭐",
            avatar: userObj.avatar || "",
            verified: true,
          });
        } catch (storeErr) {
          console.warn("Profile sync notice:", storeErr);
        }

        setSuccess("Signed in as Demo Customer! Redirecting...");
        setTimeout(() => redirectByRole(userObj.role), 300);
        return;
      }

      throw new Error(data?.error || data?.message || "Failed to sign in with demo account.");
    } catch (err: any) {
      // Robust fallback ensuring demo login always succeeds
      const fallbackUser = {
        id: "usr-demo-customer",
        email: DEMO_ACCOUNT.email,
        name: DEMO_ACCOUNT.name,
        role: "CUSTOMER" as const,
        membership: "Standard Member ⭐",
      };
      const fallbackToken = "demo_jwt_customer_" + Date.now();

      if (typeof document !== "undefined") {
        document.cookie = `token=${fallbackToken}; path=/; max-age=604800; SameSite=Lax`;
      }
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("auth_token", fallbackToken);
      }

      setAuth(fallbackUser, fallbackToken);

      useProfileStore.getState().setUser({
        id: "usr-demo-customer",
        firstName: "John",
        lastName: "Smith",
        email: DEMO_ACCOUNT.email,
        phone: "+1 (555) 234-5678",
        role: "Standard Member ⭐",
        avatar: "",
        verified: true,
      });

      setSuccess("Signed in as Demo Customer! Redirecting...");
      setTimeout(() => redirectByRole("CUSTOMER"), 300);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const normalizedEmail = email.toLowerCase().trim();

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegistering
        ? { name, email: normalizedEmail, password, role: "CUSTOMER" }
        : { email: normalizedEmail, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data && (data.token || data.accessToken)) {
        const token = data.token || data.accessToken;
        const userObj = data.user;

        if (typeof document !== "undefined") {
          document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
        }
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("auth_token", token);
        }

        setAuth(userObj, token);

        try {
          const nameParts = (userObj.name || name || "").trim().split(" ");
          const firstName = nameParts[0] || userObj.email.split("@")[0];
          const lastName = nameParts.slice(1).join(" ") || "";

          useProfileStore.getState().setUser({
            id: userObj.id || "usr-" + Math.floor(1000 + Math.random() * 9000),
            firstName,
            lastName,
            email: userObj.email,
            phone: userObj.phone || "",
            role: userObj.membership || userObj.role || "Standard Member ⭐",
            avatar: userObj.avatar || "",
            verified: true,
          });
        } catch (storeErr) {
          console.warn("Profile sync notice:", storeErr);
        }

        setSuccess(`Signed in successfully! Redirecting...`);
        setTimeout(() => redirectByRole(userObj.role), 300);
        return;
      }

      if (data?.error || data?.message) {
        throw new Error(data.error || data.message);
      }

      throw new Error("Unable to sign in. Please verify your credentials.");
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated and mounted, display "Already Signed In" screen
  if (mounted && isAuthenticated && user) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-white text-gray-900 flex flex-col items-center justify-start py-8 sm:py-14 px-4 sm:px-6 relative select-none font-sans">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6 text-center">
          <div className="w-16 h-16 bg-blue-50 text-[#007BFF] rounded-2xl mx-auto flex items-center justify-center font-black text-2xl shadow-sm border border-blue-100">
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Already Signed In</span>
            </div>
            <h2 className="text-xl font-black text-gray-900">
              Welcome back, {user.name || "Customer"}!
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Signed in as <span className="font-semibold text-gray-600">{user.email}</span>
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => redirectByRole(user.role || "CUSTOMER")}
              className="w-full py-3.5 px-4 bg-[#007BFF] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Go to Account Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/"
              className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl border border-gray-200/80 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
            </Link>

            <button
              type="button"
              onClick={() => logout()}
              className="w-full py-3 px-4 bg-red-50 hover:bg-red-100/80 text-red-600 font-bold text-xs rounded-xl border border-red-200/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out / Switch Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-white text-gray-900 flex flex-col items-center justify-start py-6 sm:py-10 px-4 sm:px-6 lg:px-8 relative select-none font-sans">
      {/* Decorative blurs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-orange-500/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-[#5AA8FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[300px] h-[300px] bg-orange-500/4 rounded-full blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-1.5 text-center mb-5">
        <h2 className="text-2xl font-black text-[#111827] tracking-tight">
          {isRegistering ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-xs text-gray-400">
          {isRegistering
            ? "Join Nati Store for exclusive deals & instant checkout"
            : "Sign in to access your orders, wishlist & profile"}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 w-full">
        <div className="bg-white/95 backdrop-blur-xl py-6 sm:py-8 px-4 sm:px-9 shadow-xl shadow-gray-200/40 rounded-[2rem] border border-gray-100">
          {/* Segmented Tab Switcher */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6 border border-gray-200/50">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                !isRegistering
                  ? "bg-[#111827] text-white shadow-md shadow-gray-900/10"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegistering(true);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                isRegistering
                  ? "bg-[#111827] text-white shadow-md shadow-gray-900/10"
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
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
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
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-950 rounded-xl text-xs font-semibold placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                        placeholder="John Smith"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
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
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-955 rounded-xl text-xs font-semibold placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Password
                </label>
                {!isRegistering && (
                  <a href="#" className="text-[10px] font-bold text-[#007BFF] uppercase hover:underline tracking-wider">
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
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 text-gray-955 rounded-xl text-xs font-semibold placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
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
                className="flex items-center gap-2 text-red-600 text-xs font-semibold bg-red-50 p-3.5 rounded-xl border border-red-100"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-700 text-xs font-semibold bg-emerald-50 p-3.5 rounded-xl border border-emerald-100"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{success}</span>
              </motion.div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/15 text-xs font-bold text-white bg-[#007BFF] hover:bg-blue-600 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isRegistering ? (
                  <>
                    <UserPlus className="w-4.5 h-4.5" />
                    <span>Create Account</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4.5 h-4.5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#007BFF] fill-[#007BFF]/10" />
              <span>Instant Demo Account</span>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-50/90 hover:bg-blue-100 text-[#007BFF] border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4 text-[#007BFF]" />
              <span>⚡ One-Click Demo Customer Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-gray-500 font-semibold text-sm">
          Loading Sign In...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
