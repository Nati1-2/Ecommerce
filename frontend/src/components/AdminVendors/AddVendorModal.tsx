"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminVendorStore } from "@/store/adminVendorStore";
import { useAddVendor } from "@/hooks/useAdminVendorQuery";
import { X, Plus, Save } from "lucide-react";

const addVendorSchema = z.object({
  storeName: z.string().min(2, "Store name required"),
  ownerName: z.string().min(2, "Owner name required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number required"),
  category: z.string().min(2, "Category required"),
  businessName: z.string().min(2, "Business entity name required"),
  taxId: z.string().min(5, "Tax EIN required"),
});

type FormValues = z.infer<typeof addVendorSchema>;

export default function AddVendorModal() {
  const { isAddModalOpen, setIsAddModalOpen } = useAdminVendorStore();
  const addVendorMutation = useAddVendor();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(addVendorSchema),
    defaultValues: {
      storeName: "",
      ownerName: "",
      email: "",
      phone: "",
      category: "Laptops & Electronics",
      businessName: "",
      taxId: "",
    },
  });

  if (!isAddModalOpen) return null;

  const onSubmit = (data: FormValues) => {
    addVendorMutation.mutate(data);
    reset();
    setIsAddModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Onboard Marketplace Vendor
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Directly provision seller store account</p>
            </div>
          </div>
          <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Store Name *</label>
            <input
              type="text"
              {...register("storeName")}
              placeholder="e.g. Apex Tech Labs"
              className="w-full mt-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.storeName && <p className="text-rose-500 mt-1">{errors.storeName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Owner Name *</label>
              <input
                type="text"
                {...register("ownerName")}
                placeholder="Alexander Vance"
                className="w-full mt-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.ownerName && <p className="text-rose-500 mt-1">{errors.ownerName.message}</p>}
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Contact Phone *</label>
              <input
                type="text"
                {...register("phone")}
                placeholder="+1 (800) 555-0199"
                className="w-full mt-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.phone && <p className="text-rose-500 mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
            <input
              type="email"
              {...register("email")}
              placeholder="alexander@apextech.io"
              className="w-full mt-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.email && <p className="text-rose-500 mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Legal Entity *</label>
              <input
                type="text"
                {...register("businessName")}
                placeholder="Apex Tech Corp LLC"
                className="w-full mt-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.businessName && <p className="text-rose-500 mt-1">{errors.businessName.message}</p>}
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Tax EIN *</label>
              <input
                type="text"
                {...register("taxId")}
                placeholder="EIN-892341908"
                className="w-full mt-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.taxId && <p className="text-rose-500 mt-1">{errors.taxId.message}</p>}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Primary Catalog Category *</label>
            <select
              {...register("category")}
              className="w-full mt-1 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="Laptops & Electronics">Laptops & Electronics</option>
              <option value="Audio">Audio & Headphones</option>
              <option value="Fashion & Tech">Fashion & Wearables</option>
              <option value="Office & Home">Office & Home Workspaces</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Onboard Store</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
