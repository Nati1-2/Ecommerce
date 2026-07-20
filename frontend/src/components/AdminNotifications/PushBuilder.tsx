"use client";

import { useState } from "react";
import { Bell, Smartphone, Monitor } from "lucide-react";

export default function PushBuilder() {
  const [pushTitle, setPushTitle] = useState("📦 Order #ord_90101 Shipped!");
  const [pushBody, setPushBody] = useState("Your package from Apex Tech Labs is on its way via FedEx.");

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Firebase Cloud Messaging (FCM) Push Builder</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-full font-bold">
          FCM Token Target
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-3">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Push Alert Title</label>
            <input
              type="text"
              value={pushTitle}
              onChange={(e) => setPushTitle(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Push Message Body</label>
            <textarea
              rows={3}
              value={pushBody}
              onChange={(e) => setPushBody(e.target.value)}
              className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
            />
          </div>
        </div>

        {/* Live Device Preview */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800 flex flex-col justify-center">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1"><Smartphone className="w-3 h-3 text-purple-400" /> Mobile Lockscreen Preview</span>
            <span>Now</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
            <p className="font-bold text-white text-xs">{pushTitle}</p>
            <p className="text-[11px] text-slate-300">{pushBody}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
