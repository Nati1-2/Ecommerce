"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import { useVendorStore } from "@/store/vendorStore";
import RatingChart from "@/components/vendor/reviews/RatingChart";
import ReviewCard from "@/components/vendor/reviews/ReviewCard";

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
      showToast("Response published to product page", "success");
    },
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Reviews & Moderation</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor customer satisfaction, reply to buyer feedback, and manage product ratings.
        </p>
      </div>

      {/* Ratings Distribution Chart */}
      <RatingChart />

      {/* Reviews Feed */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Verified Buyer Reviews</h3>
        {isLoading ? (
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
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
