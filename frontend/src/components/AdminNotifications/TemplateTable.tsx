"use client";

import { useNotificationTemplates } from "@/hooks/useAdminNotificationQuery";
import { useAdminNotificationStore } from "@/store/adminNotificationStore";
import { LayoutTemplate, Edit, Trash2, Eye } from "lucide-react";

export default function TemplateTable() {
  const { data: templates = [], isLoading } = useNotificationTemplates();
  const setPreviewTemplate = useAdminNotificationStore((state) => state.setPreviewTemplate);

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5 text-purple-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Notification Template Library</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">{templates.length} Templates</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">Template Name</th>
              <th className="py-3 px-4">Category Type</th>
              <th className="py-3 px-4">Channel</th>
              <th className="py-3 px-4">Last Updated</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {templates.map((tpl) => (
              <tr key={tpl.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{tpl.name}</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{tpl.type}</td>
                <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">{tpl.channel}</td>
                <td className="py-3 px-4 text-slate-500">{tpl.updatedAt}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setPreviewTemplate(tpl)}
                      className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg"
                      title="Preview Template"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
