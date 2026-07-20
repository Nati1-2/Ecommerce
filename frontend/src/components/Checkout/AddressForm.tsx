"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Address } from "@/types";
import { X } from "lucide-react";

export const addressSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(7, "Phone number must be at least 7 characters"),
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  initialData?: Address | null;
  onSubmit: (data: AddressFormValues) => void;
  onCancel: () => void;
}

export default function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      country: "USA",
      postalCode: "",
    },
  });

  return (
    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-50 pb-3">
        <h4 className="font-black text-gray-900 text-sm">
          {initialData ? "Edit Address Details" : "Add New Address"}
        </h4>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Fields Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
              First Name
            </label>
            <input
              type="text"
              {...register("firstName")}
              placeholder="e.g. John"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
            />
            {errors.firstName && (
              <span className="text-[10px] font-bold text-red-500 mt-1 block">
                {errors.firstName.message}
              </span>
            )}
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              {...register("lastName")}
              placeholder="e.g. Smith"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
            />
            {errors.lastName && (
              <span className="text-[10px] font-bold text-red-500 mt-1 block">
                {errors.lastName.message}
              </span>
            )}
          </div>
        </div>

        {/* Phone Field */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            Phone Number
          </label>
          <input
            type="text"
            {...register("phone")}
            placeholder="e.g. +1 (555) 000-0000"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
          />
          {errors.phone && (
            <span className="text-[10px] font-bold text-red-500 mt-1 block">
              {errors.phone.message}
            </span>
          )}
        </div>

        {/* Street Address */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            Street Address
          </label>
          <input
            type="text"
            {...register("street")}
            placeholder="e.g. 123 Main St, Apt 4B"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
          />
          {errors.street && (
            <span className="text-[10px] font-bold text-red-500 mt-1 block">
              {errors.street.message}
            </span>
          )}
        </div>

        {/* City & State Fields Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
              City
            </label>
            <input
              type="text"
              {...register("city")}
              placeholder="New York"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
            />
            {errors.city && (
              <span className="text-[10px] font-bold text-red-500 mt-1 block">
                {errors.city.message}
              </span>
            )}
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
              State / Province
            </label>
            <input
              type="text"
              {...register("state")}
              placeholder="NY"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
            />
            {errors.state && (
              <span className="text-[10px] font-bold text-red-500 mt-1 block">
                {errors.state.message}
              </span>
            )}
          </div>
        </div>

        {/* Country & Zip Fields Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
              Country
            </label>
            <input
              type="text"
              {...register("country")}
              placeholder="USA"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
            />
            {errors.country && (
              <span className="text-[10px] font-bold text-red-500 mt-1 block">
                {errors.country.message}
              </span>
            )}
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
              Postal / Zip Code
            </label>
            <input
              type="text"
              {...register("postalCode")}
              placeholder="10001"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
            />
            {errors.postalCode && (
              <span className="text-[10px] font-bold text-red-500 mt-1 block">
                {errors.postalCode.message}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 font-bold text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/10"
          >
            {isSubmitting ? "Saving..." : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
}
