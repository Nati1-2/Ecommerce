"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle, Quote } from "lucide-react";
import { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
  index: number;
}

function ReviewCard({ review, index }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#007BFF]/30 hover:shadow-lg transition-all duration-300 flex flex-col gap-4"
    >
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-[#007BFF]/20 -mb-2" />

      {/* Stars */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-4 h-4 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-100"}`}
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-gray-700 text-sm leading-relaxed flex-1">"{review.text}"</p>

      {/* Product */}
      {review.product && (
        <p className="text-xs text-[#007BFF] font-medium">Purchased: {review.product}</p>
      )}

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
        <img
          src={review.avatar}
          alt={review.author}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#007BFF]/20"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-gray-900 truncate">{review.author}</span>
            {review.verified && (
              <CheckCircle className="w-3.5 h-3.5 text-[#007BFF] shrink-0" />
            )}
          </div>
          <span className="text-xs text-gray-400">{review.date}</span>
        </div>
      </div>
    </motion.div>
  );
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[#007BFF] text-sm font-semibold uppercase tracking-widest mb-2">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#111827]">Loved by Customers</h2>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm">
            Don't just take our word for it — hear from our community of happy shoppers.
          </p>

          {/* Overall rating */}
          <div className="inline-flex items-center gap-3 mt-6 bg-white rounded-2xl px-6 py-3 shadow-sm border border-gray-100">
            <span className="text-4xl font-black text-[#111827]">4.9</span>
            <div className="text-left">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Based on 50,000+ reviews</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
