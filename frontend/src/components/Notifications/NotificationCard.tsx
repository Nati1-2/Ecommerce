"use client";

import { Notification } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Package, CreditCard, Tag, ShieldAlert, Info, Trash2, MailOpen, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useNotificationStore } from "@/store/notificationStore";
import Link from "next/link";

interface Props {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

export default function NotificationCard({ notification, onClick }: Props) {
  const { markAsRead, deleteNotification } = useNotificationStore();

  const getIcon = () => {
    switch (notification.type) {
      case "ORDER":
        return <Package className="w-6 h-6 text-blue-500" />;
      case "PAYMENT":
        return <CreditCard className="w-6 h-6 text-emerald-500" />;
      case "PROMOTION":
        return <Tag className="w-6 h-6 text-purple-500" />;
      case "SECURITY":
        return <ShieldAlert className="w-6 h-6 text-red-500" />;
      case "SYSTEM":
        return <Info className="w-6 h-6 text-gray-500" />;
      default:
        return <Info className="w-6 h-6 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case "ORDER":
        return "bg-blue-50 dark:bg-blue-900/20";
      case "PAYMENT":
        return "bg-emerald-50 dark:bg-emerald-900/20";
      case "PROMOTION":
        return "bg-purple-50 dark:bg-purple-900/20";
      case "SECURITY":
        return "bg-red-50 dark:bg-red-900/20";
      case "SYSTEM":
        return "bg-gray-50 dark:bg-gray-800/50";
      default:
        return "bg-gray-50 dark:bg-gray-800/50";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative group p-4 sm:p-5 rounded-2xl border transition-all ${
        notification.read
          ? "bg-white dark:bg-[#111827] border-gray-100 dark:border-gray-800"
          : "bg-blue-50/30 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 shadow-sm"
      }`}
    >
      <div className="flex gap-4 cursor-pointer" onClick={() => onClick(notification)}>
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getBgColor()}`}>
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-base font-semibold truncate ${notification.read ? "text-gray-900 dark:text-gray-100" : "text-gray-900 dark:text-white"}`}>
              {notification.title}
            </h3>
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <p className={`mt-1 text-sm line-clamp-2 ${notification.read ? "text-gray-500 dark:text-gray-400" : "text-gray-600 dark:text-gray-300 font-medium"}`}>
            {notification.message}
          </p>

          {notification.actionUrl && (
            <div className="mt-3">
              <Link
                href={notification.actionUrl}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                View Details &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
        {!notification.read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(notification.id);
            }}
            className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors tooltip-trigger"
            title="Mark as read"
          >
            <MailOpen className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteNotification(notification.id);
          }}
          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors tooltip-trigger"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {!notification.read && (
        <div className="absolute top-5 -left-1.5 w-3 h-3 bg-primary-500 rounded-full border-2 border-white dark:border-[#111827]" />
      )}
    </motion.div>
  );
}
