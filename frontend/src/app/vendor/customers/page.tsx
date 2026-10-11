"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import CustomerProfileModal from "@/components/vendor/customers/CustomerProfileModal";
import { VendorCustomer } from "@/types/vendor";
import { Users, Award, DollarSign, Search, Eye, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VendorCustomersPage() {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<VendorCustomer | null>(null);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["vendor-customers"],
    queryFn: vendorApi.getCustomers,
  });

  const vipCount = customers.filter((c) => c.status === "VIP").length;
  const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Customer Directory & Buyer Insights
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Analyze buyer behaviors, store order frequency, customer lifetime value, and VIP tiers.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Total Registered Buyers</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">{customers.length}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">VIP Tier Customers</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 tabular-nums">{vipCount}</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Total Customer Revenue</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer by name or email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Market Location</th>
                <th className="py-3.5 px-6">Order Volume</th>
                <th className="py-3.5 px-6">Lifetime Spent</th>
                <th className="py-3.5 px-6">Last Active</th>
                <th className="py-3.5 px-6">Loyalty Tier</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-semibold">
                    Loading customer data from live database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          No Customer Records Found
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Customers purchasing products from your store will be recorded here automatically.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={customer.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs">{customer.name}</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {customer.location || "Online"}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white text-xs tabular-nums">
                      {customer.totalOrders} orders
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900 dark:text-white tabular-nums">
                      ${customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {customer.lastPurchaseDate}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={cn(
                          "text-[11px] font-bold px-2.5 py-0.5 rounded-full border",
                          customer.status === "VIP"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                            : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                        )}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomerProfileModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}
