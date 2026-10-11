"use client";

import { VendorReview } from "@/types/vendor";
import { Star, MessageSquare } from "lucide-react";

interface Props {
  reviews?: VendorReview[];
}

export default function RatingChart({ reviews = [] }: Props) {
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)));
    counts[star] = (counts[star] || 0) + 1;
  });

  const ratings = [5, 4, 3, 2, 1].map((star) => ({
    stars: star,
    count: counts[star],
    percent: totalReviews > 0 ? (counts[star] / totalReviews) * 100 : 0,
  }));

  return (
    <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-8">
      {/* Overall Score */}
      <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl shrink-0 text-center w-full md:w-52 border border-slate-100 dark:border-slate-800">
        <span className="text-4xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
          {averageRating}
        </span>
        <div className="flex items-center gap-1 text-amber-400 mt-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-4 h-4 ${
                s <= Math.round(Number(averageRating))
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300 dark:text-slate-600"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
          {totalReviews} Verified Review{totalReviews === 1 ? "" : "s"}
        </p>
      </div>

      {/* Distribution Bars */}
      <div className="flex-1 w-full space-y-2.5">
        {totalReviews === 0 ? (
          <div className="py-4 text-center text-xs text-slate-400 space-y-1">
            <MessageSquare className="w-5 h-5 mx-auto text-slate-300 dark:text-slate-600" />
            <p>No customer reviews received yet. Ratings will be aggregated as buyers review your products.</p>
          </div>
        ) : (
          ratings.map((r) => (
            <div key={r.stars} className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 w-12 shrink-0 font-bold text-slate-700 dark:text-slate-300">
                <span>{r.stars}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${r.percent}%` }}
                />
              </div>
              <span className="w-12 text-right font-mono text-slate-400 dark:text-slate-500 tabular-nums">
                {r.count}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
