"use client";

import { useFeedbackSentiment } from "@/hooks/useAdminReviewQuery";
import { ThumbsUp, ThumbsDown, MessageCircle, Lightbulb } from "lucide-react";

export default function FeedbackInsights() {
  const { data: sentiment, isLoading } = useFeedbackSentiment();

  if (isLoading || !sentiment) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Customer Feedback Sentiment & NLP Insights</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Automated Text Mining</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Positive Keywords */}
        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 rounded-2xl space-y-2">
          <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
            <ThumbsUp className="w-4 h-4 text-emerald-500" /> Top Positive Keywords
          </h4>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {sentiment.positiveKeywords.map((kw) => (
              <span key={kw.word} className="px-2.5 py-1 bg-white dark:bg-slate-800 font-semibold text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm">
                "{kw.word}" <strong className="text-slate-400 font-mono">({kw.count})</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Negative Keywords */}
        <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/60 rounded-2xl space-y-2">
          <h4 className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
            <ThumbsDown className="w-4 h-4 text-rose-500" /> Frequent Friction Points
          </h4>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {sentiment.negativeKeywords.map((kw) => (
              <span key={kw.word} className="px-2.5 py-1 bg-white dark:bg-slate-800 font-semibold text-rose-700 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-800 shadow-sm">
                "{kw.word}" <strong className="text-slate-400 font-mono">({kw.count})</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Feature Suggestions */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
        <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-500" /> Key Customer Suggestions
        </h4>
        <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
          {sentiment.suggestions.map((sug, i) => (
            <li key={i}>{sug}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
