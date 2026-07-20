"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import CustomerProfileModal from "@/components/vendor/customers/CustomerProfileModal";
import { VendorCustomer } from "@/types/vendor";
import { Users, Award, DollarSign, Search, Eye } from "lucide-react";
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Relationship Management</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Analyze customer purchasing behaviors, order counts, lifetime value, and VIP tiers.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Registered Buyers</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{customers.length}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-500 font-medium">VIP Tier Customers</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{vipCount}</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-500 font-medium">Total Customer Revenue</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer by name, email or city..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Location</th>
                <th className="py-3.5 px-6">Orders</th>
                <th className="py-3.5 px-6">Lifetime Spent</th>
                <th className="py-3.5 px-6">Last Purchase</th>
                <th className="py-3.5 px-6">Tier</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={customer.avatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">{customer.name}</p>
                        <p className="text-[11px] text-slate-400">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {customer.location}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white text-xs">
                    {customer.totalOrders} orders
                  </td>
                  <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white">
                    ${customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                    {customer.lastPurchaseDate}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={cn(
                        "text-[11px] font-bold px-2.5 py-0.5 rounded-full border",
                        customer.status === "VIP"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/40"
                          : "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/40"
                      )}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
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
