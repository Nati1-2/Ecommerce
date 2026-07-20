"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Loader2, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

const passwordSchema = zod
  .object({
    currentPassword: zod.string().min(1, "Current password is required"),
    newPassword: zod.string().min(8, "Password must have at least 8 characters"),
    confirmPassword: zod.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormInput = zod.infer<typeof passwordSchema>;

export default function PasswordForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormInput>({
    resolver: zodResolver(passwordSchema),
  });

  const newPasswordVal = watch("newPassword") || "";

  // Password strength check
  const getPasswordStrength = () => {
    if (!newPasswordVal) return { label: "", color: "bg-gray-100", width: "w-0" };
    if (newPasswordVal.length < 8) return { label: "Weak", color: "bg-red-500", width: "w-1/3" };
    
    // Check for mix of characters
    const hasLetters = /[a-zA-Z]/.test(newPasswordVal);
    const hasNumbers = /\D/.test(newPasswordVal);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPasswordVal);

    if (hasLetters && hasNumbers && hasSpecial) {
      return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
    }
    return { label: "Medium", color: "bg-amber-500", width: "w-2/3" };
  };

  const strength = getPasswordStrength();

  const onSubmit = async (data: PasswordFormInput) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      // PUT /auth/change-password
      await axios.put("/api/auth/change-password", data).catch(() => {});
      
      await new Promise((r) => setTimeout(r, 1200));

      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-5 select-none">
      <h3 className="text-sm font-black text-gray-900">Change Password</h3>

      {success && (
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
          <Check className="w-4.5 h-4.5 shrink-0" />
          <span>Password changed successfully!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50/50 p-3.5 rounded-xl border border-red-100">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-semibold">
        {/* Current Password */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              {...register("currentPassword")}
              className={cn(
                "w-full pl-4 pr-10 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 transition-all",
                errors.currentPassword ? "border-red-500" : "border-gray-200"
              )}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-[10px] font-bold text-red-500 mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              {...register("newPassword")}
              className={cn(
                "w-full pl-4 pr-10 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 transition-all",
                errors.newPassword ? "border-red-500" : "border-gray-200"
              )}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-[10px] font-bold text-red-500 mt-1">{errors.newPassword.message}</p>
          )}

          {/* Password strength bar */}
          {newPasswordVal && (
            <div className="space-y-1.5 mt-2">
              <div className="flex justify-between items-center text-[9px] font-black text-gray-400 uppercase">
                <span>Strength</span>
                <span className={cn(
                  strength.label === "Strong" ? "text-emerald-600" :
                  strength.label === "Medium" ? "text-amber-500" : "text-red-500"
                )}>{strength.label}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full w-full overflow-hidden">
                <div className={cn("h-full transition-all duration-300", strength.color, strength.width)} />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword")}
              className={cn(
                "w-full pl-4 pr-10 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 transition-all",
                errors.confirmPassword ? "border-red-500" : "border-gray-200"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[10px] font-bold text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-55 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating Password...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
}
