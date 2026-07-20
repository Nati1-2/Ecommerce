"use client";

import { useState, useRef } from "react";
import { useProfileStore } from "@/store/profileStore";
import { Camera, Trash2, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import axios from "axios";

export default function AvatarUpload() {
  const { user, setUser } = useProfileStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // 1. File size validation (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("File size exceeds 2MB limit. Please choose a smaller image.");
      return;
    }

    // 2. Format validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file format. Only JPEG, PNG, and WebP are allowed.");
      return;
    }

    setLoading(true);

    try {
      // Create local preview immediately for reactive UI
      const localUrl = URL.createObjectURL(file);
      
      // In production, hit POST /users/avatar
      const formData = new FormData();
      formData.append("avatar", file);
      
      await axios.post("/api/users/avatar", formData).catch(() => {});

      // Simulate network upload latency
      await new Promise((r) => setTimeout(r, 1200));

      setUser({ avatar: localUrl });
    } catch (err: any) {
      setError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    setError(null);

    try {
      // In production: DELETE /users/avatar
      await new Promise((r) => setTimeout(r, 800));
      setUser({ avatar: "" });
    } catch (err) {
      setError("Failed to remove avatar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 select-none">
      {/* Profile picture frame */}
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500/20 shrink-0 bg-gray-50 flex items-center justify-center">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xl font-black text-gray-400">
            {user.firstName[0]}
            {user.lastName[0]}
          </span>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-white">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}
      </div>

      {/* Button actions */}
      <div className="space-y-1.5 flex-1 min-w-0 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          {/* File select trigger */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="py-2 px-3.5 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            {user.avatar ? <RefreshCw className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
            {user.avatar ? "Replace Photo" : "Upload Photo"}
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {user.avatar && (
            <button
              onClick={handleRemove}
              disabled={loading}
              className="py-2 px-3.5 bg-white hover:bg-red-50 border border-gray-200 text-gray-500 hover:text-red-500 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          )}
        </div>

        <p className="text-[9px] text-gray-400 font-semibold mt-1">
          Allowed JPEG, PNG or WebP. Max size of 2MB.
        </p>

        {error && (
          <div className="flex items-center justify-center sm:justify-start gap-1 text-[9px] font-bold text-red-500 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
