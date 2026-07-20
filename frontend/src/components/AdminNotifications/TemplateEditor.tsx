"use client";

import { useState } from "react";
import { useAdminNotificationStore } from "@/store/adminNotificationStore";
import { useCreateTemplate } from "@/hooks/useAdminNotificationQuery";
import { LayoutTemplate, X, Save } from "lucide-react";
import { NotificationChannel } from "@/types/adminNotification";

export default function TemplateEditor() {
  const { isTemplateModalOpen, setIsTemplateModalOpen, previewTemplate, setPreviewTemplate } =
    useAdminNotificationStore();
  const createTemplateMutation = useCreateTemplate();

  const [name, setName] = useState("");
  const [type, setType] = useState("Transactional");
  const [channel, setChannel] = useState<NotificationChannel>("Email");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  if (!isTemplateModalOpen && !previewTemplate) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createTemplateMutation.mutate({ name, type, channel, subject, content });
    setIsTemplateModalOpen(false);
    setPreviewTemplate(null);
  };

  const isPreview = !!previewTemplate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-2xl">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {isPreview ? "Template Preview" : "Create Notification Template"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Save reusable message layouts</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsTemplateModalOpen(false);
              setPreviewTemplate(null);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isPreview ? (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">{previewTemplate.name}</p>
              <p className="text-slate-400">Channel: {previewTemplate.channel} • Type: {previewTemplate.type}</p>
            </div>
            {previewTemplate.subject && (
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300">Subject:</span>{" "}
                <span>{previewTemplate.subject}</span>
              </div>
            )}
            <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto">
              {previewTemplate.content}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Template Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Order Dispatch Email"
                className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Category Type</label>
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as NotificationChannel)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                >
                  <option value="Email">Email</option>
                  <option value="Push">Push</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Subject / Header</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Your Order #{{order_id}} has been shipped"
                className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Template Content Body</label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Template text or HTML body..."
                className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-500/20 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Save Template
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
