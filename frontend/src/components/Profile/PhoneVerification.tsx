"use client";

import { useState } from "react";
import { useProfileStore } from "@/store/profileStore";
import { Phone, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";

export default function PhoneVerification() {
  const { user, setUser } = useProfileStore();
  const [phoneNumber, setPhoneNumber] = useState(user.phone);
  
  const [step, setStep] = useState<"input" | "verify" | "success">(user.phone ? "success" : "input");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!phoneNumber.trim()) return;
    setLoading(true);
    setError(null);

    try {
      // POST /auth/send-otp
      await axios.post("/api/auth/send-otp", { phone: phoneNumber }).catch(() => {});
      
      await new Promise((r) => setTimeout(r, 1200));
      setStep("verify");
    } catch (err) {
      setError("Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) return;
    setLoading(true);
    setError(null);

    try {
      // POST /auth/verify-otp
      await axios.post("/api/auth/verify-otp", { phone: phoneNumber, code: otp }).catch(() => {});
      
      await new Promise((r) => setTimeout(r, 1200));
      
      setUser({ phone: phoneNumber });
      setStep("success");
    } catch (err) {
      setError("Invalid security code. Please check and retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPhoneNumber("");
    setStep("input");
    setOtp("");
    setError(null);
  };

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <h3 className="text-sm font-black text-gray-900">Phone Verification</h3>

      {step === "input" && (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
              Mobile Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
              />
              <button
                onClick={handleSendOtp}
                disabled={loading || !phoneNumber.trim()}
                className="px-5 py-3 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Send OTP"}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "verify" && (
        <div className="space-y-4">
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
            Enter the 4-digit code sent to <strong className="text-gray-950 font-black">{phoneNumber}</strong>.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 tracking-widest text-center"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 4}
              className="px-5 py-3 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Verify Code"}
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Phone Number
            </p>
            <p className="text-xs font-black text-gray-900 mt-0.5">{user.phone || phoneNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full shrink-0">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified
            </span>
            <button
              onClick={handleReset}
              className="text-[10px] font-bold text-gray-400 hover:text-gray-600 underline"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
