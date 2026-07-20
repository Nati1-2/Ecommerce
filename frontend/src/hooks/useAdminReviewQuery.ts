"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminReviewApi } from "@/services/api/adminReviewApi";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";

export function useReviewStats() {
  return useQuery({
    queryKey: ["admin-review-stats"],
    queryFn: adminReviewApi.getReviewStats,
  });
}

export function useAdminReviews() {
  return useQuery({
    queryKey: ["admin-reviews-list"],
    queryFn: adminReviewApi.getReviews,
  });
}

export function useAIRiskScore(reviewId: string) {
  return useQuery({
    queryKey: ["admin-ai-risk-score", reviewId],
    queryFn: () => adminReviewApi.getAIRiskScore(reviewId),
    enabled: !!reviewId,
  });
}

export function useReviewReports() {
  return useQuery({
    queryKey: ["admin-review-reports"],
    queryFn: adminReviewApi.getReports,
  });
}

export function useProductRatings() {
  return useQuery({
    queryKey: ["admin-product-ratings"],
    queryFn: adminReviewApi.getProductRatings,
  });
}

export function useVendorRatings() {
  return useQuery({
    queryKey: ["admin-vendor-ratings"],
    queryFn: adminReviewApi.getVendorRatings,
  });
}

export function useFeedbackSentiment() {
  return useQuery({
    queryKey: ["admin-feedback-sentiment"],
    queryFn: adminReviewApi.getFeedbackSentiment,
  });
}

export function useApproveReview() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (id: string) => adminReviewApi.approveReview(id),
    onSuccess: (approved) => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-review-stats"] });
      showToast(`Review "${approved.id}" published publicly!`, "success");
    },
  });
}

export function useRemoveReview() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminReviewApi.removeReview(id, reason),
    onSuccess: (removed) => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-review-stats"] });
      showToast(`Review "${removed.id}" removed from catalog`, "error");
    },
  });
}

export function useDismissReport() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (reportId: string) => adminReviewApi.dismissReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-review-reports"] });
      showToast("Report case dismissed", "info");
    },
  });
}

export function useBulkApproveReviews() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (ids: string[]) => adminReviewApi.bulkApproveReviews(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-review-stats"] });
      showToast("Selected reviews approved!", "success");
    },
  });
}

export function useBulkRemoveReviews() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (ids: string[]) => adminReviewApi.bulkRemoveReviews(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-review-stats"] });
      showToast("Selected reviews removed!", "error");
    },
  });
}
