"use client";

import { useState } from "react";
import { VendorReview } from "@/types/vendor";
import { Star, MessageCircle, Flag, EyeOff, CornerDownRight, Send } from "lucide-react";

interface Props {
  review: VendorReview;
  onReply: (reviewId: string, text: string) => void;
}

export default function ReviewCard({ review, onReply }: Props) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    onReply(review.id, replyText.trim());
    setIsReplying(false);
    setReplyText("");
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Top Header: Customer info & Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={review.customerAvatar}
            alt={review.customerName}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">{review.customerName}</h4>
            <p className="text-[11px] text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-xl w-fit">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-amber-400" : "text-slate-300 dark:text-slate-700"}`}
            />
          ))}
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-1">{review.rating}.0</span>
        </div>
      </div>

      {/* Product reference */}
      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
        <img src={review.productImage} alt="" className="w-10 h-10 rounded-xl object-cover" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{review.productName}</p>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">Product ID: {review.productId}</span>
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
        "{review.comment}"
      </p>

      {/* Vendor Existing Reply */}
      {review.reply && (
        <div className="p-4 bg-blue-50/60 dark:bg-blue-950/20 border-l-4 border-blue-600 rounded-r-2xl space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300">
            <CornerDownRight className="w-4 h-4" />
            <span>Store Official Response</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300">{review.reply.text}</p>
        </div>
      )}

      {/* Reply Input Box */}
      {isReplying && (
        <div className="mt-4 space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <textarea
            rows={2}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write an official seller response to this review..."
            className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsReplying(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSendReply}
              className="px-4 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              Post Reply
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {!isReplying && (
        <div className="flex items-center justify-end gap-3 pt-2 text-xs">
          {!review.reply && (
            <button
              onClick={() => setIsReplying(true)}
              className="px-3 py-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold rounded-xl transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Reply
            </button>
          )}
          <button className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Flag className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
