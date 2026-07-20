"use client";

import { useState } from "react";
import { useProfileStore } from "@/store/profileStore";
import { CheckCircle, Info, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

export default function PrivacySettings() {
  const { preferences, setPreferences } = useProfileStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [marketing, setMarketing] = useState(preferences.marketingEmails);
  const [recommend, setRecommend] = useState(preferences.recommendations);
  const [pubProfile, setPubProfile] = useState(preferences.publicProfile);

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      // PUT /users/preferences
      const payload = {
        marketingEmails: marketing,
        recommendations: recommend,
        publicProfile: pubProfile,
      };
      await axios.put("/api/users/preferences", payload).catch(() => {});
      
      await new Promise((r) => setTimeout(r, 1000));
      setPreferences(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-5 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-4.5 h-4.5 text-gray-400" />
          Account Privacy & Preferences
        </h3>
        <button
          onClick={handleSave}
          disabled={loading}
          className="py-1.5 px-3.5 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1 shrink-0"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 animate-fadeIn">
          <CheckCircle className="w-4.5 h-4.5 shrink-0" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      <div className="space-y-4 text-xs font-semibold text-gray-700">
        {/* Marketing option */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#007BFF] focus:ring-[#007BFF]/30 mt-0.5"
          />
          <div className="flex-1">
            <p className="text-gray-900 font-bold">Allow marketing emails</p>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5 leading-snug">
              Receive notifications on discount clearances, weekly deals, and personalized promotions.
            </p>
          </div>
        </label>

        {/* Product Recommendations option */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={recommend}
            onChange={(e) => setRecommend(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#007BFF] focus:ring-[#007BFF]/30 mt-0.5"
          />
          <div className="flex-1">
            <p className="text-gray-900 font-bold">Allow product recommendations</p>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5 leading-snug">
              Show personalized suggestions based on your search histories and purchase logs.
            </p>
          </div>
        </label>

        {/* Public profile option */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={pubProfile}
            onChange={(e) => setPubProfile(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#007BFF] focus:ring-[#007BFF]/30 mt-0.5"
          />
          <div className="flex-1">
            <p className="text-gray-900 font-bold">Show profile publicly</p>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5 leading-snug">
              Allow other community members to discover your reviews history and public profile listings.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
