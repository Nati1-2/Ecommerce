"use client";

import { useAIRiskScore } from "@/hooks/useAdminReviewQuery";
import { ShieldAlert, ShieldCheck, AlertTriangle, Cpu } from "lucide-react";

interface Props {
  reviewId: string;
}

export default function ModerationScore({ reviewId }: Props) {
  const { data: result, isLoading } = useAIRiskScore(reviewId);

  if (isLoading || !result) {
    return <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />;
  }

  const isHighRisk = result.riskLevel === "High";

  return (
    <div
      className={`p-4 rounded-2xl border text-xs space-y-3 ${
        isHighRisk
          ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200"
          : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold">
          <Cpu className="w-4 h-4 text-blue-500" />
          <span>AI Moderation Risk Analysis Engine</span>
        </div>
        <span
          className={`font-black px-2.5 py-0.5 rounded-full text-[11px] ${
            isHighRisk ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
          }`}
        >
          {result.riskLevel} Risk ({result.riskScore}/100)
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div>
          <span className="text-slate-500">Spam Probability:</span>{" "}
          <strong className="font-mono font-bold">{result.spamProbability}%</strong>
        </div>
        <div>
          <span className="text-slate-500">Fake Probability:</span>{" "}
          <strong className="font-mono font-bold">{result.fakeProbability}%</strong>
        </div>
        <div>
          <span className="text-slate-500">Offensive Content:</span>{" "}
          <strong className="font-bold">{result.offensiveLanguageDetected ? "Yes ⚠️" : "No ✓"}</strong>
        </div>
        <div>
          <span className="text-slate-500">Duplicate Check:</span>{" "}
          <strong className="font-bold">{result.duplicateContent ? "Detected ⚠️" : "Clean ✓"}</strong>
        </div>
      </div>

      {result.flags.length > 0 && (
        <div className="pt-2 border-t border-rose-200 dark:border-rose-800 space-y-1">
          <p className="font-bold flex items-center gap-1 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-3.5 h-3.5" /> Triggered Safety Flags:
          </p>
          <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
            {result.flags.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
