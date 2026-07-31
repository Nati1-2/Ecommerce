"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Trash2, Filter, Shield, ShoppingBag, Tag } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "order" | "promo" | "system";
  read: boolean;
  createdAt: string;
}

export default function DashboardNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_all_read" }),
    }).catch(() => {});
  };

  const handleToggleRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
    fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle_read", notifId: id }),
    }).catch(() => {});
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => (filter === "unread" ? !n.read : true));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-4 h-4 text-blue-600" />;
      case "promo":
        return <Tag className="w-4 h-4 text-amber-600" />;
      default:
        return <Shield className="w-4 h-4 text-emerald-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-8 border border-gray-100 bg-white rounded-3xl animate-pulse space-y-4">
        <div className="h-6 w-40 bg-gray-100 rounded-lg"></div>
        <div className="h-24 bg-gray-50 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-100 bg-white rounded-3xl shadow-sm space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900">Notifications</h2>
            <p className="text-[11px] text-gray-400 font-semibold">
              System alerts, order updates, and promotions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 bg-gray-100 rounded-xl flex text-xs font-bold">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === "all" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === "unread" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Unread
            </button>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="py-2 px-3 text-xs font-bold text-[#007BFF] hover:bg-blue-50 rounded-xl transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-xs text-gray-400 font-semibold">
          No notifications found.
        </div>
      ) : (
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                !n.read ? "bg-blue-50/20" : "hover:bg-gray-50/50"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200/60 flex items-center justify-center shrink-0 mt-0.5">
                  {getTypeIcon(n.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-gray-900">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#007BFF] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-gray-400 font-semibold pt-0.5">
                    {new Date(n.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggleRead(n.id)}
                  className="p-1.5 text-gray-400 hover:text-[#007BFF] hover:bg-blue-50 rounded-lg transition-colors"
                  title={n.read ? "Mark as unread" : "Mark as read"}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
