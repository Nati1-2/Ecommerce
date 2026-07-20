"use client";

import { Notification } from "@/types";
import { X } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useNotificationStore } from "@/store/notificationStore";

interface Props {
  notification: Notification;
  onClose: () => void;
}

export default function NotificationModal({ notification, onClose }: Props) {
  const { deleteNotification, markAsRead } = useNotificationStore();

  const handleDelete = () => {
    deleteNotification(notification.id);
    onClose();
  };

  const handleMarkAsRead = () => {
    markAsRead(notification.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notification Details</h2>
            {!notification.read && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full">
                New
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {notification.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">
              {format(new Date(notification.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </p>
            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              {notification.message}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {notification.actionUrl && (
              <Link
                href={notification.actionUrl}
                onClick={onClose}
                className="w-full sm:w-auto flex-1 inline-flex justify-center items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors"
              >
                Take Action
              </Link>
            )}
            {!notification.read && (
              <button
                onClick={handleMarkAsRead}
                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-xl transition-colors"
              >
                Mark as Read
              </button>
            )}
            <button
              onClick={handleDelete}
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 text-sm font-bold rounded-xl transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
