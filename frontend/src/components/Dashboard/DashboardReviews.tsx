"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, Plus, CheckCircle2, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  createdAt: string;
  reply?: string;
  status: string;
}

export default function DashboardReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [productName, setProductName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.warn("Reviews fetch notice:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: productName || "Apex Smart Watch Ultra",
          productImage: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80",
          rating,
          comment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchReviews();
        setModalOpen(false);
        setProductName("");
        setComment("");
      }
    } catch (err) {
      console.error("Submit review error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 border border-gray-100 bg-white rounded-3xl animate-pulse space-y-4">
        <div className="h-6 w-40 bg-gray-100 rounded-lg"></div>
        <div className="h-32 bg-gray-50 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-100 bg-white rounded-3xl shadow-sm space-y-6 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900">My Product Reviews</h2>
            <p className="text-[11px] text-gray-400 font-semibold">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"} submitted for purchased products
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="py-2.5 px-4 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/15 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Write Review
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <p className="text-xs text-gray-400 font-semibold">You haven't submitted any reviews yet.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs font-bold text-[#007BFF] hover:underline"
          >
            Write a review for your recent purchase
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 border border-gray-100 bg-[#F5F7FA]/40 hover:bg-white rounded-2xl space-y-3 transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0">
                    <Image src={rev.productImage} alt={rev.productName} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900">{rev.productName}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-gray-400 font-semibold shrink-0">
                  {new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>

              <p className="text-xs text-gray-700 font-medium leading-relaxed bg-white p-3.5 rounded-xl border border-gray-100">
                "{rev.comment}"
              </p>

              {rev.reply && (
                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#007BFF]">Seller Reply</span>
                  <p className="text-gray-600 font-medium">{rev.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 border border-gray-100 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-base font-black text-gray-900">Write Product Review</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateReview} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Apex Smart Watch Ultra"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Review Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your honest feedback about quality, features, and performance..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/15 flex items-center justify-center gap-2 transition-all"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
