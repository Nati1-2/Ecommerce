"use client";

import { AdminVendorModel } from "@/types/adminVendor";
import VendorRow from "./VendorRow";

interface Props {
  vendors: AdminVendorModel[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
}

export default function VendorTable({
  vendors,
  selectedIds,
  onToggleSelect,
  onSelectAll,
}: Props) {
  const isAllSelected = vendors.length > 0 && selectedIds.length === vendors.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectAll([]);
    } else {
      onSelectAll(vendors.map((v) => v.id));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
            <tr>
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                />
              </th>
              <th className="py-3.5 px-6">Store Name & ID</th>
              <th className="py-3.5 px-6">Owner Contact</th>
              <th className="py-3.5 px-6">Category</th>
              <th className="py-3.5 px-6">Rating & Sales</th>
              <th className="py-3.5 px-6">Gross Revenue</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Verification</th>
              <th className="py-3.5 px-6">Joined Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400 text-sm">
                  No marketplace vendor applications found matching your active filters.
                </td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <VendorRow
                  key={vendor.id}
                  vendor={vendor}
                  isSelected={selectedIds.includes(vendor.id)}
                  onToggleSelect={onToggleSelect}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
