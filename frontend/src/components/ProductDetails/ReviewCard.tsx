"use client";

import { useState } from "react";
import { Star, CheckCircle, ThumbsUp } from "lucide-react";
import { Review } from "@/types";
import { RatingStars } from "@/components/shared/RatingStars";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [voted, setVoted] = useState(false);

  const handleHelpful = () => {
    if (voted) return;
    setHelpfulCount(helpfulCount + 1);
    setVoted(true);
  };

  return (
    <div className="py-5 border-b border-gray-50 flex flex-col gap-3">
      {/* Reviewer Header */}
      <div className="flex items-center gap-3">
        <img
          src={review.avatar}
          alt={review.author}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#007BFF]/10"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-gray-900 truncate">{review.author}</span>
            {review.verified && (
              <CheckCircle className="w-3.5 h-3.5 text-[#007BFF] shrink-0" />
            )}
          </div>
          <span className="text-[10px] text-gray-400 font-medium">{review.date}</span>
        </div>

        {/* Stars */}
        <RatingStars rating={review.rating} size="w-3 h-3" />
      </div>

      {/* Review Comment Text */}
      <p className="text-gray-600 text-sm leading-relaxed font-medium">"{review.text}"</p>

      {/* Uploaded images inside review */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-1">
          {review.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="Review attachment"
              className="w-16 h-16 object-cover rounded-xl border border-gray-100 shadow-sm"
            />
          ))}
        </div>
      )}

      {/* Helpful button action */}
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={handleHelpful}
          disabled={voted}
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
            voted
              ? "bg-blue-50 border-blue-100 text-[#007BFF]"
              : "bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Helpful ({helpfulCount})</span>
        </button>
      </div>
    </div>
  );
}
