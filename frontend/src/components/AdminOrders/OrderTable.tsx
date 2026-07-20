"use client";

import { AdminOrderModel } from "@/types/adminOrder";
import OrderRow from "./OrderRow";

interface Props {
  orders: AdminOrderModel[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onCancelOrder: (id: string) => void;
}

export default function OrderTable({
  orders,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onCancelOrder,
}: Props) {
  const isAllSelected = orders.length > 0 && selectedIds.length === orders.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectAll([]);
    } else {
      onSelectAll(orders.map((o) => o.id));
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
              <th className="py-3.5 px-6">Order ID</th>
              <th className="py-3.5 px-6">Customer</th>
              <th className="py-3.5 px-6">Vendor Store</th>
              <th className="py-3.5 px-6">Item Preview</th>
              <th className="py-3.5 px-6">Total Amount</th>
              <th className="py-3.5 px-6">Payment</th>
              <th className="py-3.5 px-6">Order Status</th>
              <th className="py-3.5 px-6">Created Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400 text-sm">
                  No marketplace orders found matching your active filter criteria.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  isSelected={selectedIds.includes(order.id)}
                  onToggleSelect={onToggleSelect}
                  onCancel={onCancelOrder}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
