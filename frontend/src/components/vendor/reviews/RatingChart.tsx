"use client";

import { Star } from "lucide-react";

export default function RatingChart() {
  const ratings = [
    { stars: 5, count: 1120, percent: 78.8 },
    { stars: 4, count: 210, percent: 14.7 },
    { stars: 3, count: 65, percent: 4.5 },
    { stars: 2, count: 18, percent: 1.2 },
    { stars: 1, count: 7, percent: 0.8 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-8">
      {/* Overall Score */}
      <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl shrink-0 text-center w-full md:w-48">
        <span className="text-4xl font-black text-slate-900 dark:text-white">4.88</span>
        <div className="flex items-center gap-1 text-amber-400 mt-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-4 h-4 fill-amber-400" />
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2 font-medium">1,420 Verified Reviews</p>
      </div>

      {/* Distribution Bars */}
      <div className="flex-1 w-full space-y-2.5">
        {ratings.map((r) => (
          <div key={r.stars} className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 w-12 shrink-0 font-bold text-slate-700 dark:text-slate-300">
              <span>{r.stars}</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${r.percent}%` }}
              />
            </div>
            <span className="w-12 text-right font-mono text-slate-400">{r.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
