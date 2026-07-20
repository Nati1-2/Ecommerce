"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Zap, Play } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setCoords({ x, y });
  };

  const productImages = images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"];

  return (
    <div className="space-y-4">
      {/* Main Image Viewport */}
      <div
        className="relative aspect-square rounded-3xl bg-[#F5F7FA] border border-gray-100 overflow-hidden cursor-zoom-in group flex items-center justify-center p-6"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={productImages[activeIndex]}
            alt={name}
            className="max-h-full max-w-full object-contain rounded-2xl drop-shadow-md select-none pointer-events-none"
          />
        </AnimatePresence>

        {/* Magnifier glass hover effect */}
        {zoom && (
          <div
            className="absolute inset-0 bg-no-repeat pointer-events-none hidden md:block"
            style={{
              backgroundImage: `url(${productImages[activeIndex]})`,
              backgroundPosition: `${coords.x}% ${coords.y}%`,
              backgroundSize: "220%",
              backgroundColor: "#F5F7FA"
            }}
          />
        )}

        {/* Zoom trigger badge icon */}
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm border border-gray-100 p-2.5 rounded-xl shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4 text-gray-700" />
        </div>
      </div>

      {/* Thumbnails grid */}
      {productImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {productImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-square rounded-2xl bg-[#F5F7FA] border overflow-hidden p-2 flex items-center justify-center transition-all ${
                activeIndex === idx
                  ? "border-[#007BFF] ring-2 ring-[#007BFF]/20"
                  : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <img src={img} alt={`${name} thumbnail ${idx}`} className="max-h-full max-w-full object-contain rounded-lg" />
              {/* Media type overlay icon indicator (video / 360) */}
              {idx === 2 && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
