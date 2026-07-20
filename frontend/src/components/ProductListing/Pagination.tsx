"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 py-6 shrink-0">
      {/* Prev button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#007BFF] hover:text-[#007BFF] bg-white transition-colors disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-500"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Pages */}
      {getPages().map((page, idx) => {
        if (page === "...") {
          return (
            <span key={`ell-${idx}`} className="w-10 h-10 flex items-center justify-center text-xs font-bold text-gray-400">
              ...
            </span>
          );
        }
        return (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page as number)}
            className={cn(
              "w-10 h-10 rounded-xl text-xs font-bold transition-all border",
              currentPage === page
                ? "bg-[#007BFF] border-[#007BFF] text-white shadow-md shadow-blue-500/20"
                : "border-gray-200 bg-white text-gray-700 hover:border-[#007BFF] hover:text-[#007BFF]"
            )}
          >
            {page}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#007BFF] hover:text-[#007BFF] bg-white transition-colors disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-500"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
