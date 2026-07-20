"use client";

import { useState } from "react";
import { useAdminNotificationStore } from "@/store/adminNotificationStore";
import { useCreateCampaign } from "@/hooks/useAdminNotificationQuery";
import { Megaphone, X, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CampaignBuilder() {
  const { isCampaignWizardOpen, setIsCampaignWizardOpen } = useAdminNotificationStore();
  const createCampaignMutation = useCreateCampaign();

  const [step, setStep] = useState(1);
  const [campaignName, setCampaignName] = useState("");
  const [audience, setAudience] = useState("All Verified Customers");
  const [channel, setChannel] = useState("Multi-Channel");
  const [message, setMessage] = useState("");

  if (!isCampaignWizardOpen) return null;

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else {
      createCampaignMutation.mutate({
        name: campaignName || "New Marketing Campaign",
        audience,
        channel,
        message,
      });
      setIsCampaignWizardOpen(false);
      setStep(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Multi-Step Campaign Builder
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Step {step} of 5</p>
            </div>
          </div>
          <button onClick={() => setIsCampaignWizardOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-4 text-xs min-h-[160px]">
          {step === 1 && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Step 1: Campaign Details & Audience</h4>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Campaign Name *</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Q3 Summer Promotional Flash Blitz"
                  className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Target Audience *</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
                >
                  <option value="All Verified Customers">All Verified Customers (250,000)</option>
                  <option value="Active Sellers">Active Marketplace Sellers (12,500)</option>
                  <option value="Inactive Users">Inactive Users (&gt;30 Days)</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Step 2: Choose Communication Channel</h4>
              <div className="grid grid-cols-2 gap-2">
                {["Multi-Channel", "Email", "Push", "SMS"].map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannel(ch)}
                    className={`p-3 rounded-xl border text-center font-bold ${
                      channel === ch
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600"
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Step 3: Create Campaign Message</h4>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter campaign copy & promotional offer text..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Step 4: Schedule Launch Time</h4>
              <p className="text-slate-500">Campaign is set to broadcast immediately upon review.</p>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Step 5: Review & Confirm</h4>
              <p>Name: <strong>{campaignName || "Summer Sale"}</strong></p>
              <p>Audience: <strong>{audience}</strong></p>
              <p>Channel: <strong>{channel}</strong></p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl disabled:opacity-30 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <span>{step === 5 ? "Launch Campaign" : "Next Step"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
