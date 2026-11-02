"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { DEFAULT_FALLBACK_IMAGE } from "@/lib/api";

interface ProductGalleryProps {
  images?: (string | { url?: string; src?: string })[];
  name: string;
  mainImage?: string;
}

export default function ProductGallery({ images, name, mainImage }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});
  const zoomRef = useRef<HTMLDivElement>(null);

  // 1. Sanitize & normalize image list
  const rawList = Array.isArray(images) && images.length > 0 ? images : mainImage ? [mainImage] : [];
  const sanitizedList: string[] = rawList
    .map((item) => {
      if (typeof item === "string" && item.trim().length > 0) return item.trim();
      if (item && typeof item === "object") {
        if (typeof item.url === "string" && item.url.trim().length > 0) return item.url.trim();
        if (typeof item.src === "string" && item.src.trim().length > 0) return item.src.trim();
      }
      return "";
    })
    .filter((url) => Boolean(url) && url !== "[object Object]");

  const productImages =
    sanitizedList.length > 0 ? sanitizedList : [DEFAULT_FALLBACK_IMAGE];

  const currentImage = brokenImages[activeIndex]
    ? DEFAULT_FALLBACK_IMAGE
    : productImages[activeIndex] || DEFAULT_FALLBACK_IMAGE;

  // Direct DOM style update for mousemove zoom — prevents triggering 60-120 React re-renders/sec
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomRef.current) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    zoomRef.current.style.backgroundPosition = `${x}% ${y}%`;
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  // Safe handler that guards against infinite state loops
  const handleImageError = (index: number) => {
    setBrokenImages((prev) => {
      if (prev[index]) return prev;
      return { ...prev, [index]: true };
    });
  };

  return (
    <div className="space-y-4 select-none">
      {/* ── MAIN IMAGE VIEWPORT ────────────────────────────────────────── */}
      <div
        className="relative aspect-square rounded-3xl bg-[#F5F7FA] border border-gray-100 overflow-hidden cursor-zoom-in group flex items-center justify-center p-6 transition-colors hover:border-gray-200"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`View full size image of ${name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsLightboxOpen(true);
          }
        }}
      >
        <img
          key={activeIndex}
          src={currentImage}
          alt={`${name} - View ${activeIndex + 1}`}
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = DEFAULT_FALLBACK_IMAGE;
            handleImageError(activeIndex);
          }}
          className="max-h-full max-w-full object-contain rounded-2xl drop-shadow-md select-none pointer-events-none transition-opacity duration-200"
        />

        {/* Magnifier glass hover effect (Desktop) — Uses ref to eliminate UI flickering */}
        {zoom && (
          <div
            ref={zoomRef}
            className="absolute inset-0 bg-no-repeat pointer-events-none hidden md:block transition-opacity duration-150"
            style={{
              backgroundImage: `url(${currentImage})`,
              backgroundPosition: "center center",
              backgroundSize: "220%",
            }}
          />
        )}

        {/* Previous / Next Arrow Controls */}
        {productImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-black shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10 hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-black shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10 hover:scale-105"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom trigger badge button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white border border-gray-200 p-2.5 rounded-xl shadow-md transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer text-gray-700 hover:text-[#007BFF] z-10"
          title="Click to expand fullscreen"
          aria-label="Expand image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Counter indicator */}
        {productImages.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-lg pointer-events-none z-10">
            {activeIndex + 1} / {productImages.length}
          </div>
        )}
      </div>

      {/* ── THUMBNAILS GRID ────────────────────────────────────────────── */}
      {productImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
          {productImages.map((img, idx) => {
            const thumbSrc = brokenImages[idx] ? DEFAULT_FALLBACK_IMAGE : img;
            const isSelected = activeIndex === idx;

            return (
              <button
                type="button"
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Select image ${idx + 1} of ${productImages.length}`}
                aria-current={isSelected ? "true" : undefined}
                className={`relative aspect-square rounded-2xl bg-[#F5F7FA] border overflow-hidden p-2 flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#007BFF] ring-2 ring-[#007BFF]/30 scale-[1.02] shadow-sm"
                    : "border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={thumbSrc}
                  alt={`${name} thumbnail ${idx + 1}`}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = DEFAULT_FALLBACK_IMAGE;
                    handleImageError(idx);
                  }}
                  className="max-h-full max-w-full object-contain rounded-lg pointer-events-none"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* ── FULLSCREEN LIGHTBOX MODAL ───────────────────────────────────── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="absolute inset-0 cursor-zoom-out"
            />

            {/* Top Bar Actions */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-20">
              <span className="text-xs font-semibold text-white/70 bg-white/10 px-3 py-1.5 rounded-xl">
                {activeIndex + 1} / {productImages.length}
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close fullscreen view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Left / Right Nav in Lightbox */}
            {productImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer z-20 hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer z-20 hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image Preview Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center z-10 p-2"
            >
              <img
                src={currentImage}
                alt={name}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = DEFAULT_FALLBACK_IMAGE;
                  handleImageError(activeIndex);
                }}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl drop-shadow-2xl"
              />
              <p className="text-white/80 font-bold text-sm sm:text-base mt-4 text-center line-clamp-1">
                {name}
              </p>

              {/* Lightbox Mini Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto max-w-full p-1 scrollbar-none">
                  {productImages.map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`w-12 h-12 rounded-xl overflow-hidden bg-white/10 border p-1 shrink-0 transition-all cursor-pointer ${
                        activeIndex === idx
                          ? "border-blue-400 ring-2 ring-blue-400/50 scale-105"
                          : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={brokenImages[idx] ? DEFAULT_FALLBACK_IMAGE : img}
                        alt={`thumb-${idx}`}
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = DEFAULT_FALLBACK_IMAGE;
                          handleImageError(idx);
                        }}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
