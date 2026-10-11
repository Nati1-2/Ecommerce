"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import { useVendorStore } from "@/store/vendorStore";
import RatingChart from "@/components/vendor/reviews/RatingChart";
import ReviewCard from "@/components/vendor/reviews/ReviewCard";
import { MessageSquareText } from "lucide-react";

export default function VendorReviewsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["vendor-reviews"],
    queryFn: vendorApi.getReviews,
  });

  const replyMutation = useMutation({
    mutationFn: ({ reviewId, text }: { reviewId: string; text: string }) =>
      vendorApi.replyReview(reviewId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-reviews"] });
      showToast("Response published to storefront product page", "success");
    },
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Customer Reviews & Product Feedback
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor customer satisfaction, reply to buyer feedback, and manage verified rating scores.
        </p>
      </div>

      {/* Ratings Distribution Chart with real live data */}
      <RatingChart reviews={reviews} />

      {/* Reviews Feed */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
          Verified Customer Feedback ({reviews.length})
        </h3>
        {isLoading ? (
          <div className="h-48 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 animate-pulse flex items-center justify-center text-slate-400 text-xs font-semibold">
            Loading reviews from live database...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800">
            <MessageSquareText className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="font-bold text-slate-900 dark:text-white text-sm">No Customer Reviews Yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-sm mx-auto">
              When buyers purchase your products and submit star ratings and feedback, they will be listed here.
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onReply={(reviewId, text) => replyMutation.mutate({ reviewId, text })}
            />
          ))
        )}
      </div>
    </div>
  );
}
