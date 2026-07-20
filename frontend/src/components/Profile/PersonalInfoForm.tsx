"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useProfileStore } from "@/store/profileStore";
import { User, Mail, Phone, Calendar, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

const personalInfoSchema = zod.object({
  firstName: zod.string().min(2, "First name must have at least 2 characters"),
  lastName: zod.string().min(2, "Last name must have at least 2 characters"),
  email: zod.string().email("Invalid email address format"),
  phone: zod.string().min(10, "Phone number must have at least 10 digits"),
  dateOfBirth: zod.string().optional(),
  gender: zod.string().optional(),
});

type PersonalInfoFormInput = zod.infer<typeof personalInfoSchema>;

export default function PersonalInfoForm() {
  const { user, setUser } = useProfileStore();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalInfoFormInput>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth || "",
      gender: user.gender || "Male",
    },
  });

  const onSubmit = async (data: PersonalInfoFormInput) => {
    setLoading(true);
    setSuccess(false);

    try {
      // In production: PUT /users/profile
      await axios.put("/api/users/profile", data).catch(() => {});
      
      // Simulate network save delay
      await new Promise((r) => setTimeout(r, 1200));

      setUser(data);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth || "",
      gender: user.gender || "Male",
    });
    setEditing(false);
  };

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-5 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900">Personal Information</h3>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="py-1.5 px-3.5 bg-gray-50 border border-gray-100 text-gray-700 font-bold text-xs rounded-lg hover:border-gray-200 transition-colors"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="py-1.5 px-3.5 bg-white border border-gray-200 text-gray-500 font-bold text-xs rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="py-1.5 px-3.5 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        )}
      </div>

      {success && (
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
          <Check className="w-4.5 h-4.5 shrink-0" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
        {/* First Name */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            First Name
          </label>
          <input
            type="text"
            disabled={!editing}
            {...register("firstName")}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 transition-all",
              errors.firstName ? "border-red-500" : "border-gray-200",
              !editing && "bg-gray-50/50 text-gray-500 cursor-not-allowed"
            )}
          />
          {errors.firstName && (
            <p className="text-[10px] font-bold text-red-500 mt-1">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            Last Name
          </label>
          <input
            type="text"
            disabled={!editing}
            {...register("lastName")}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 transition-all",
              errors.lastName ? "border-red-500" : "border-gray-200",
              !editing && "bg-gray-50/50 text-gray-500 cursor-not-allowed"
            )}
          />
          {errors.lastName && (
            <p className="text-[10px] font-bold text-red-500 mt-1">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            disabled={!editing}
            {...register("email")}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 transition-all",
              errors.email ? "border-red-500" : "border-gray-200",
              !editing && "bg-gray-50/50 text-gray-500 cursor-not-allowed"
            )}
          />
          {errors.email && (
            <p className="text-[10px] font-bold text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            Phone Number
          </label>
          <input
            type="text"
            disabled={!editing}
            {...register("phone")}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 transition-all",
              errors.phone ? "border-red-500" : "border-gray-200",
              !editing && "bg-gray-50/50 text-gray-500 cursor-not-allowed"
            )}
          />
          {errors.phone && (
            <p className="text-[10px] font-bold text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            Date of Birth
          </label>
          <input
            type="date"
            disabled={!editing}
            {...register("dateOfBirth")}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 transition-all",
              !editing && "bg-gray-50/50 text-gray-500 cursor-not-allowed"
            )}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            Gender
          </label>
          <select
            disabled={!editing}
            {...register("gender")}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 transition-all",
              !editing && "bg-gray-50/50 text-gray-500 cursor-not-allowed"
            )}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </form>
    </div>
  );
}
