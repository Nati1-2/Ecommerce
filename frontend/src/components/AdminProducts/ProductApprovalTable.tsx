"use client";

import { AdminProductModel } from "@/types/adminProduct";
import ProductRow from "./ProductRow";

interface Props {
  products: AdminProductModel[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductApprovalTable({
  products,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeleteProduct,
}: Props) {
  const isAllSelected = products.length > 0 && selectedIds.length === products.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectAll([]);
    } else {
      onSelectAll(products.map((p) => p.id));
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
              <th className="py-3.5 px-6">Product Image & SKU</th>
              <th className="py-3.5 px-6">Vendor Store</th>
              <th className="py-3.5 px-6">Category</th>
              <th className="py-3.5 px-6">Price</th>
              <th className="py-3.5 px-6">Inventory Stock</th>
              <th className="py-3.5 px-6">Rating</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Submitted Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400 text-sm">
                  No catalog products found matching your active filter criteria.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  isSelected={selectedIds.includes(product.id)}
                  onToggleSelect={onToggleSelect}
                  onDelete={onDeleteProduct}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
