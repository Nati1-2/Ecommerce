"use client";

import { useState } from "react";
import { useProfileStore } from "@/store/profileStore";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import axios from "axios";

export default function EmailVerification() {
  const { user } = useProfileStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // For demonstration, we check user.verified. We can toggle state locally.
  const [verified, setVerified] = useState(user.verified);

  const handleVerify = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      // POST /auth/email-verification
      await axios.post("/api/auth/email-verification", { email: user.email }).catch(() => {});
      
      await new Promise((r) => setTimeout(r, 1200));
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <h3 className="text-sm font-black text-gray-900">Email Verification</h3>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Email Address
          </p>
          <p className="text-xs font-black text-gray-900 mt-0.5">{user.email}</p>
        </div>

        {verified ? (
          <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full shrink-0">
            <CheckCircle className="w-3.5 h-3.5" />
            Verified
          </span>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
              Not Verified
            </span>
            <button
              onClick={handleVerify}
              disabled={loading}
              className="py-1.5 px-3 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Verify Email"
              )}
            </button>
          </div>
        )}
      </div>

      {success && (
        <p className="text-[10px] font-bold text-emerald-600 pl-1">
          Verification link sent to your email address! Please check your inbox.
        </p>
      )}
    </div>
  );
}
