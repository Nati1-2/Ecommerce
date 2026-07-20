"use client";

import { useState } from "react";
import { useProfileStore } from "@/store/profileStore";
import { ShieldCheck, ShieldAlert, KeyRound, Copy, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TwoFactorAuth() {
  const { security, setTwoFactor } = useProfileStore();
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"idle" | "setup" | "backup">("idle");
  const [copied, setCopied] = useState(false);

  const backupCodes = ["AURA-1289-4912", "AURA-9823-1102", "AURA-5491-9238", "AURA-7712-4029"];

  const handleStartSetup = () => {
    setStep("setup");
  };

  const handleVerify = async () => {
    if (verificationCode.length < 6) return;
    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1200));
      setTwoFactor(true);
      setStep("backup");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setTwoFactor(false);
      setStep("idle");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
          <KeyRound className="w-4.5 h-4.5 text-gray-400" />
          Two-Factor Authentication (2FA)
        </h3>
        <span className={cn(
          "text-[9px] font-black px-2 py-0.5 rounded-full border",
          security.twoFactorEnabled
            ? "text-emerald-700 bg-emerald-50 border-emerald-100"
            : "text-gray-500 bg-gray-50 border-gray-100"
        )}>
          {security.twoFactorEnabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      {step === "idle" && (
        <div className="space-y-4">
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
            Enhance your account security by requiring a 6-digit confirmation code in addition to your password.
          </p>

          {security.twoFactorEnabled ? (
            <button
              onClick={handleDisable}
              disabled={loading}
              className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-red-100/50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Disable 2FA Security"}
            </button>
          ) : (
            <button
              onClick={handleStartSetup}
              className="w-full py-3 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm shadow-blue-500/10"
            >
              Configure 2FA
            </button>
          )}
        </div>
      )}

      {step === "setup" && (
        <div className="space-y-4">
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
            Scan QR Code or configure authenticator app and enter the 6-digit verification code.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000 000"
              maxLength={6}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 text-center tracking-widest"
            />
            <button
              onClick={handleVerify}
              disabled={loading || verificationCode.length < 6}
              className="px-5 py-3 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Verify Code"}
            </button>
          </div>
        </div>
      )}

      {step === "backup" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-400 font-semibold">
              Save your backup recovery codes in a secure location.
            </p>
            <button
              onClick={handleCopy}
              className="text-[10px] font-bold text-[#007BFF] flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 p-3.5 bg-gray-50 border border-gray-100 rounded-2xl font-mono text-[10px] text-gray-900 font-black text-center">
            {backupCodes.map((code) => (
              <span key={code} className="p-1.5 bg-white border border-gray-200/50 rounded-lg select-all">
                {code}
              </span>
            ))}
          </div>

          <button
            onClick={() => setStep("idle")}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            I Saved These Codes
          </button>
        </div>
      )}
    </div>
  );
}
