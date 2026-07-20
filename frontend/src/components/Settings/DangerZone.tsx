"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { settingsApi } from "@/services/api/settings";
import { useSettingsStore } from "@/store/settingsStore";
import { AlertTriangle, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";

export default function DangerZone() {
  const { showToast } = useSettingsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");

  const deleteMutation = useMutation({
    mutationFn: (pwd: string) => settingsApi.deleteAccount(pwd),
    onSuccess: () => {
      showToast("Account deleted successfully");
      setIsModalOpen(false);
      // Here you would redirect the user to home / clear tokens
    },
    onError: (error: Error) => {
      showToast(error.message || "Failed to delete account", "error");
    }
  });

  const handleDelete = () => {
    if (!password) {
      showToast("Please enter your password", "error");
      return;
    }
    deleteMutation.mutate(password);
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-500">Danger Zone</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Irreversible actions related to your account.
        </p>
      </div>

      <div className="max-w-3xl">
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500 rounded-lg shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900 dark:text-red-400">Delete Account</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-2 leading-relaxed">
                Once you delete your account, there is no going back. Please be certain. All your data, orders, wishlists, and personal information will be permanently erased.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => showToast("Account deactivated. You can log back in anytime to reactivate.", "info")}
              className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors w-full sm:w-auto"
            >
              Deactivate Temporarily
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account Permanently
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPassword("");
        }}
        title="Delete Account"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This action cannot be undone. Please enter your password to confirm you want to permanently delete your account.
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password (mock: password123)"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
            />
          </div>
          <div className="pt-4 flex gap-3 justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting..." : "Confirm Deletion"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
