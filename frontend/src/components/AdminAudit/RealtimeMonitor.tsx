"use client";

import { Radio, ShieldAlert } from "lucide-react";

export default function RealtimeMonitor() {
  const liveEvents = [
    { time: "Just now", event: "LOGIN_ATTEMPT", details: "Admin Alexander Vance logged in from 192.168.1.105", status: "Success" },
    { time: "2s ago", event: "PERMISSION_CHANGE", details: "Role 'Vendor Admin' permissions updated", status: "Audited" },
    { time: "5s ago", event: "PAYMENT_ACTION", details: "Refund of $699.00 issued for Order #ord_90101", status: "Verified" },
  ];

  return (
    <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h3 className="text-base font-bold text-white">Socket.IO Live Streaming Log Telemetry</h3>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-400">1,400 events/sec</span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {liveEvents.map((ev, idx) => (
          <div key={idx} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-bold">{ev.event}</span>
              <span className="text-slate-300 text-[11px] truncate max-w-md">{ev.details}</span>
            </div>
            <span className="text-[10px] text-slate-400 shrink-0">{ev.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
