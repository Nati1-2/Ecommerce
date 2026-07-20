"use client";

import { AdminReviewModel } from "@/types/adminReview";
import ReviewRow from "./ReviewRow";

interface Props {
  reviews: AdminReviewModel[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
}

export default function ReviewTable({
  reviews,
  selectedIds,
  onToggleSelect,
  onSelectAll,
}: Props) {
  const isAllSelected = reviews.length > 0 && selectedIds.length === reviews.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectAll([]);
    } else {
      onSelectAll(reviews.map((r) => r.id));
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
              <th className="py-3.5 px-6">Customer</th>
              <th className="py-3.5 px-6">Product</th>
              <th className="py-3.5 px-6">Vendor Store</th>
              <th className="py-3.5 px-6">Rating</th>
              <th className="py-3.5 px-6">Review Text</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Submitted Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                  No customer reviews found matching your active filter criteria.
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <ReviewRow
                  key={review.id}
                  review={review}
                  isSelected={selectedIds.includes(review.id)}
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
