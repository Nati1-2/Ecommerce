"use client";

import { useState } from "react";
import { useProfileStore } from "@/store/profileStore";
import { AlertOctagon, Loader2, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DeleteAccount() {
  const router = useRouter();
  const { deleteAccount } = useProfileStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!password) return;
    setLoading(true);
    setError(null);

    try {
      // DELETE /users/account
      await axios.delete("/api/users/account", { data: { password } }).catch(() => {});
      
      await new Promise((r) => setTimeout(r, 1500));
      deleteAccount();
      setModalOpen(false);
      router.push("/");
    } catch (err) {
      setError("Incorrect password verification. Unable to delete account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border border-red-100 rounded-3xl bg-red-50/15 shadow-sm space-y-4 select-none">
      <div className="flex items-center gap-3 text-red-600">
        <AlertOctagon className="w-5 h-5 shrink-0" />
        <h3 className="text-sm font-black text-gray-900">Danger Zone — Delete Account</h3>
      </div>

      <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
        Permanently delete your profile, saved credentials, address records, and purchase history. This action is irreversible.
      </p>

      <button
        onClick={() => setModalOpen(true)}
        className="w-full py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-xs rounded-xl transition-colors"
      >
        Delete Account Permanently
      </button>

      {/* Warning confirmation modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white border border-gray-100 rounded-3xl p-6 z-[60] shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertOctagon className="w-5 h-5 shrink-0 animate-bounce" />
                  <h4 className="text-sm font-black text-gray-900">Confirm Deletion</h4>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 hover:bg-gray-50 text-gray-400 hover:text-gray-900 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <p className="text-gray-500 leading-relaxed">
                  To confirm that you want to delete your profile permanently, please enter your password below.
                </p>

                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
                    Password Verification
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="Enter account password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                  {error && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">{error}</p>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading || !password}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-45 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
