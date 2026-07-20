"use client";

import { useState } from "react";
import { Star, Camera, Plus, Check } from "lucide-react";
import { Review } from "@/types";
import { RatingStars } from "@/components/shared/RatingStars";
import ReviewCard from "./ReviewCard";

interface ReviewSectionProps {
  productId: string;
  initialReviews: Review[];
}

export default function ReviewSection({ productId, initialReviews }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Review statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newReview: Review = {
      id: Math.random().toString(),
      author: name,
      avatar: `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 10) + 1}`,
      rating,
      date: "Just now",
      text: comment,
      verified: true,
      helpfulCount: 0
    };

    setReviews([newReview, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setName("");
      setComment("");
      setRating(5);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Overall Review Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 border border-gray-100 rounded-3xl">
        {/* Average Rating Block */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-gray-200/60">
          <span className="text-5xl font-black text-gray-900 tracking-tight">{averageRating}</span>
          <div className="mt-2.5">
            <RatingStars rating={parseFloat(averageRating)} size="w-4 h-4" />
          </div>
          <span className="text-xs text-gray-400 font-semibold mt-2">
            Based on {totalReviews} reviews
          </span>
        </div>

        {/* Rating Bars Breakdown Block */}
        <div className="space-y-2 md:col-span-2 flex flex-col justify-center px-0 md:px-4">
          {ratingCounts.map(({ stars, percentage, count }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-600 w-6 text-right">{stars}★</span>
              <div className="flex-1 h-2 bg-gray-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400 w-10">
                {Math.round(percentage)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Actions header */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-50 pb-4">
        <h4 className="font-black text-gray-900 text-base">Reviews ({totalReviews})</h4>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 bg-[#111827] hover:bg-[#007BFF] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Write a Review
        </button>
      </div>

      {/* Write review inline Form collapsible panel */}
      {showForm && (
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4 max-w-xl">
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center gap-3 py-6">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-500 shadow-md">
                <Check className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-gray-900">Review Submitted!</h5>
              <p className="text-xs text-gray-400">Thank you for sharing your experience.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h5 className="font-bold text-gray-900 text-sm">Write your review</h5>
              
              {/* Star selector */}
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Rating</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      type="button"
                      key={stars}
                      onClick={() => setRating(stars)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          stars <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & comments inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Your Name</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Add Photos (Mock)</span>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-200 hover:border-[#007BFF] hover:text-[#007BFF] px-4 py-3 rounded-xl text-xs font-semibold text-gray-400 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    Attach Images
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Comments</span>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 hover:-translate-y-0.5"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      )}

      {/* Review Listing list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No reviews yet. Be the first to write one!</p>
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}
