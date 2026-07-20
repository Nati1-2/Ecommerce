export type ReviewStatus = "Published" | "Pending" | "Reported" | "Removed";

export interface AdminReviewModel {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  isVerifiedBuyer: boolean;
  productName: string;
  productSku: string;
  productImage: string;
  vendorStore: string;
  rating: number;
  comment: string;
  images: string[];
  status: ReviewStatus;
  createdAt: string;
}

export interface ModerationResult {
  reviewId: string;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High";
  spamProbability: number;
  fakeProbability: number;
  offensiveLanguageDetected: boolean;
  duplicateContent: boolean;
  flags: string[];
}

export interface ReportedReviewCase {
  id: string;
  reviewId: string;
  reporterName: string;
  reason: string;
  comment: string;
  status: "Open" | "Investigating" | "Resolved";
  createdAt: string;
}

export interface ReviewStatsData {
  totalReviews: number;
  totalGrowth: number;
  avgRating: number;
  pendingCount: number;
  reportedCount: number;
  removedCount: number;
}

export interface ReviewFilterCriteria {
  searchQuery: string;
  ratingFilter: string;
  statusFilter: string;
  dateFilter: string;
}

export interface ProductReviewPerformance {
  productName: string;
  vendorStore: string;
  rating: number;
  totalReviews: number;
  salesCount: number;
}

export interface VendorReviewPerformance {
  vendorStore: string;
  avgRating: number;
  totalReviews: number;
  complaintCount: number;
  status: string;
}

export interface FeedbackSentimentData {
  positiveKeywords: { word: string; count: number }[];
  negativeKeywords: { word: string; count: number }[];
  commonComplaints: string[];
  suggestions: string[];
}
