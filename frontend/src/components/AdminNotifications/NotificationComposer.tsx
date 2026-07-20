"use client";

import { useState } from "react";
import { useSendNotification } from "@/hooks/useAdminNotificationQuery";
import { NotificationChannel } from "@/types/adminNotification";
import { Send, Clock, Image as ImageIcon, Link as LinkIcon, Users, Mail, Bell, Smartphone, Zap } from "lucide-react";

export default function NotificationComposer() {
  const sendMutation = useSendNotification();

  const [channel, setChannel] = useState<NotificationChannel>("Email");
  const [audience, setAudience] = useState("All Verified Customers");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [scheduleOption, setScheduleOption] = useState<"now" | "later">("now");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    sendMutation.mutate({
      channel,
      audience,
      title,
      message,
      imageUrl,
      buttonLabel,
      buttonLink,
      scheduleOption,
    });

    setTitle("");
    setMessage("");
    setImageUrl("");
    setButtonLabel("");
    setButtonLink("");
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-600" />
          Broadcast Notification Composer
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Dispatch multi-channel communication across Email (SMTP), Firebase Cloud Messaging (Push), SMS, or Socket.IO.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Channel & Target Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Select Communication Channel *</label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {(["Email", "Push", "SMS", "Realtime"] as NotificationChannel[]).map((ch) => {
                const isSel = channel === ch;

                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannel(ch)}
                    className={`p-3 rounded-xl border text-center font-bold transition-all flex flex-col items-center gap-1.5 ${
                      isSel
                        ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {ch === "Email" && <Mail className="w-4 h-4" />}
                    {ch === "Push" && <Bell className="w-4 h-4" />}
                    {ch === "SMS" && <Smartphone className="w-4 h-4" />}
                    {ch === "Realtime" && <Zap className="w-4 h-4" />}
                    <span>{ch}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Target Audience Segment *</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full mt-2 px-3 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
            >
              <option value="All Verified Customers">All Verified Customers (250,000)</option>
              <option value="Active Sellers">Active Marketplace Sellers (12,500)</option>
              <option value="Platform Administrators">Platform Administrators (45)</option>
              <option value="Inactive Users (>30 Days)">Inactive Users (&gt;30 Days)</option>
            </select>
          </div>
        </div>

        {/* Title / Subject */}
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300">
            {channel === "Email" ? "Email Subject Line *" : "Notification Title *"}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={channel === "Email" ? "e.g. 🎉 Flash Sale: Up to 50% Off Electronics!" : "e.g. Order #ord_90101 Dispatched!"}
            className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            required
          />
        </div>

        {/* Message Content */}
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300">Message Content / Body *</label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your HTML or plain text message content here... Supports template tags like {{username}} and {{order_id}}."
            className="w-full mt-1.5 p-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            required
          />
        </div>

        {/* Media & Action Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-blue-500" /> Image Banner URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/banner.jpg"
              className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">CTA Button Label</label>
            <input
              type="text"
              value={buttonLabel}
              onChange={(e) => setButtonLabel(e.target.value)}
              placeholder="e.g. Claim Discount"
              className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-blue-500" /> Action Target URL
            </label>
            <input
              type="text"
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              placeholder="https://marketplace.com/sale"
              className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
            />
          </div>
        </div>

        {/* Dispatch Options & Submit */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
              <input
                type="radio"
                name="schedule"
                checked={scheduleOption === "now"}
                onChange={() => setScheduleOption("now")}
                className="text-blue-600"
              />
              Send Immediately
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
              <input
                type="radio"
                name="schedule"
                checked={scheduleOption === "later"}
                onChange={() => setScheduleOption("later")}
                className="text-blue-600"
              />
              Schedule for Later
            </label>
          </div>

          <button
            type="submit"
            disabled={sendMutation.isPending}
            className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {scheduleOption === "now" ? "Broadcast Notification" : "Schedule Broadcast"}
          </button>
        </div>
      </form>
    </div>
  );
}
