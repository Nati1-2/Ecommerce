import type {
  AdminReviewModel, ReviewStatsData, ModerationResult, ReportedReviewCase,
  ProductReviewPerformance, VendorReviewPerformance, FeedbackSentimentData,
  ReviewStatus,
} from "@/types/adminReview";

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options, headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function getReviews(): Promise<AdminReviewModel[]> {
  const data = await apiFetch<{ reviews: Array<AdminReviewModel & { vendorName?: string }> }>("/api/admin/reviews");
  return data.reviews.map((review) => ({
    ...review,
    customerAvatar: review.customerAvatar || "",
    customerEmail: review.customerEmail || "",
    isVerifiedBuyer: Boolean(review.isVerifiedBuyer),
    productSku: review.productSku || "",
    images: review.images || [],
    vendorStore: review.vendorStore || review.vendorName || "",
  }));
}

async function updateReview(id: string, status: ReviewStatus): Promise<AdminReviewModel> {
  await apiFetch("/api/admin/reviews", {
    method: "PATCH", body: JSON.stringify({ id, status }),
  });
  const review = (await getReviews()).find((item) => item.id === id);
  if (!review) throw new Error("Updated review not found");
  return review;
}

export const adminReviewApi = {
  getReviewStats: async (): Promise<ReviewStatsData> => {
    const list = await getReviews();
    return {
      totalReviews: list.length, totalGrowth: 0,
      avgRating: list.length ? Math.round(list.reduce((sum, item) => sum + item.rating, 0) / list.length * 10) / 10 : 0,
      pendingCount: list.filter((item) => item.status === "Pending").length,
      reportedCount: list.filter((item) => item.status === "Reported").length,
      removedCount: list.filter((item) => item.status === "Removed").length,
    };
  },
  getReviews,
  getReviewById: async (id: string): Promise<AdminReviewModel | undefined> =>
    (await getReviews()).find((review) => review.id === id),
  approveReview: async (id: string): Promise<AdminReviewModel> => updateReview(id, "Published"),
  removeReview: async (id: string, _reason: string): Promise<AdminReviewModel> => updateReview(id, "Removed"),
  getAIRiskScore: async (_reviewId: string): Promise<ModerationResult> => {
    throw new Error("AI risk scoring is not configured.");
  },
  getReports: async (): Promise<ReportedReviewCase[]> => [],
  dismissReport: async (_reportId: string): Promise<boolean> => {
    throw new Error("Review reporting is not connected to a persistent service.");
  },
  getProductRatings: async (): Promise<ProductReviewPerformance[]> => {
    const list = await getReviews();
    const groups = new Map<string, AdminReviewModel[]>();
    for (const review of list) groups.set(review.productName, [...(groups.get(review.productName) || []), review]);
    return [...groups].map(([productName, reviews]) => ({
      productName, vendorStore: reviews[0].vendorStore,
      rating: Math.round(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length * 10) / 10,
      totalReviews: reviews.length, salesCount: 0,
    }));
  },
  getVendorRatings: async (): Promise<VendorReviewPerformance[]> => {
    const list = await getReviews();
    const groups = new Map<string, AdminReviewModel[]>();
    for (const review of list) groups.set(review.vendorStore, [...(groups.get(review.vendorStore) || []), review]);
    return [...groups].map(([vendorStore, reviews]) => ({
      vendorStore,
      avgRating: Math.round(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length * 10) / 10,
      totalReviews: reviews.length, complaintCount: reviews.filter((review) => review.rating <= 2).length,
      status: "",
    }));
  },
  getFeedbackSentiment: async (): Promise<FeedbackSentimentData> => ({
    positiveKeywords: [], negativeKeywords: [], commonComplaints: [], suggestions: [],
  }),
  bulkApproveReviews: async (ids: string[]): Promise<boolean> => {
    await Promise.all(ids.map((id) => updateReview(id, "Published")));
    return true;
  },
  bulkRemoveReviews: async (ids: string[]): Promise<boolean> => {
    await Promise.all(ids.map((id) => updateReview(id, "Removed")));
    return true;
  },
};
