"use client";

import { Monitor, Smartphone, Tablet, Cpu } from "lucide-react";
import { VisitorStats, DeviceType } from "@/types/adminVisitors";

interface DeviceOSProps {
  stats: VisitorStats;
  selectedDevice: string;
  onSelectDevice: (device: string) => void;
}

export default function DeviceOSDistribution({
  stats,
  selectedDevice,
  onSelectDevice,
}: DeviceOSProps) {
  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case "Mobile":
        return Smartphone;
      case "Tablet":
        return Tablet;
      case "Desktop":
      default:
        return Monitor;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Device Breakdown */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-600" />
              Device Hardware Profile
            </h3>
            <p className="text-xs text-slate-500">Visitor devices (PC, Smartphone, Tablet)</p>
          </div>
          {selectedDevice !== "all" && (
            <button
              onClick={() => onSelectDevice("all")}
              className="text-[11px] font-bold text-blue-600 hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-3">
          {stats.deviceBreakdown.map((item) => {
            const Icon = getDeviceIcon(item.deviceType);
            const isSelected = selectedDevice.toLowerCase() === item.deviceType.toLowerCase();

            return (
              <button
                key={item.deviceType}
                onClick={() => onSelectDevice(isSelected ? "all" : item.deviceType)}
                className={`w-full p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/50 shadow-sm"
                    : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/70"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{item.deviceType === "Desktop" ? "Desktop (PC / Mac)" : item.deviceType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-normal">{item.count} visits</span>
                    <span className="font-extrabold text-blue-600">{item.percentage}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Operating System Breakdown */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-600" />
            Operating Systems (OS)
          </h3>
          <p className="text-xs text-slate-500">Distribution of client platforms</p>
        </div>

        <div className="space-y-3">
          {stats.osBreakdown.map((item) => (
            <div key={item.os} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span className="font-bold text-slate-800">{item.os}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{item.count} visits</span>
                  <span className="font-extrabold text-purple-600">{item.percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
