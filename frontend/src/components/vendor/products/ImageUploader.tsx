"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: Props) {
  const [newUrl, setNewUrl] = useState("");

  const handleAddImage = () => {
    if (!newUrl.trim()) return;
    onChange([...images, newUrl.trim()]);
    setNewUrl("");
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Quick preset sample image handler for easy demo
  const handleAddPreset = (url: string) => {
    if (!images.includes(url)) {
      onChange([...images, url]);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
        <span>Product Media & Gallery</span>
        <span className="text-slate-400 font-normal">{images.length} images added</span>
      </label>

      {/* Preset demo images */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
        <span className="font-medium">Demo presets:</span>
        <button
          type="button"
          onClick={() => handleAddPreset("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80")}
          className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 text-blue-600 dark:text-blue-400"
        >
          Headphones
        </button>
        <button
          type="button"
          onClick={() => handleAddPreset("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80")}
          className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 text-blue-600 dark:text-blue-400"
        >
          Laptop
        </button>
        <button
          type="button"
          onClick={() => handleAddPreset("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80")}
          className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 text-blue-600 dark:text-blue-400"
        >
          Monitor
        </button>
      </div>

      {/* Input URL */}
      <div className="flex gap-2">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Paste image URL (https://...)"
          className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 outline-none"
        />
        <button
          type="button"
          onClick={handleAddImage}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="group relative h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <img src={img} alt={`Product media ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {index === 0 && (
              <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 bg-slate-900/80 text-white rounded-md backdrop-blur-sm">
                Main Image
              </span>
            )}
          </div>
        ))}

        {images.length === 0 && (
          <div className="col-span-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center text-slate-400">
            <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-xs font-semibold">Drag and drop images or paste a URL above</p>
          </div>
        )}
      </div>
    </div>
  );
}
