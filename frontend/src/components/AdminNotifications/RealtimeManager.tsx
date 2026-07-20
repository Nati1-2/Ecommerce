"use client";

import { Zap, Radio, CheckCircle2 } from "lucide-react";

export default function RealtimeManager() {
  const events = [
    { name: "NEW_ORDER", desc: "Broadcast when a buyer completes checkout", subscribers: 12400, status: "Active" },
    { name: "PAYMENT_SUCCESS", desc: "Broadcast upon Stripe webhook confirmation", subscribers: 14500, status: "Active" },
    { name: "PRODUCT_APPROVED", desc: "Broadcast to seller when product is published", subscribers: 890, status: "Active" },
    { name: "MESSAGE_RECEIVED", desc: "Live chat communication message event", subscribers: 4200, status: "Active" },
    { name: "SYSTEM_ALERT", desc: "Platform maintenance and security notifications", subscribers: 250000, status: "Active" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Socket.IO Realtime Event Bus Manager</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-full font-bold">
          5 Active Event Streams
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {events.map((ev) => (
          <div key={ev.name} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="font-mono text-blue-600 dark:text-blue-400">{ev.name}</span>
              <span className="text-emerald-600 flex items-center gap-1 font-bold text-[10px]">
                <CheckCircle2 className="w-3 h-3" /> {ev.status}
              </span>
            </div>
            <p className="text-slate-500">{ev.desc}</p>
            <p className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-200/60 dark:border-slate-800">
              Subscribers: <strong>{ev.subscribers.toLocaleString()} active sockets</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
