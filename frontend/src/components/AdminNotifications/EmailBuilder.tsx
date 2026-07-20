"use client";

import { useState } from "react";
import { Mail, Code, Eye, Sparkles } from "lucide-react";

export default function EmailBuilder() {
  const [subject, setSubject] = useState("Your Marketplace Order #{{order_id}} has been confirmed!");
  const [htmlContent, setHtmlContent] = useState(
    `<div style="font-family: Arial; padding: 20px;">
  <h2 style="color: #007BFF;">Order Confirmed!</h2>
  <p>Hello <strong>{{username}}</strong>,</p>
  <p>Thank you for shopping at our marketplace. Your order <strong>#{{order_id}}</strong> has been processed.</p>
</div>`
  );

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">HTML Email Template Designer & Tokens</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full font-bold">
          SendGrid / SMTP Engine
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300">Email Subject Line</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Code className="w-3.5 h-3.5 text-blue-500" /> HTML Template Source
          </label>
          <textarea
            rows={5}
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            className="w-full mt-1 p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] outline-none"
          />
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500">Available Variables:</span>
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-600 rounded">{"{{username}}"}</span>
            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-950/40 text-purple-600 rounded">{"{{order_id}}"}</span>
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded">{"{{amount}}"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
