import {
  AdminReviewModel,
  ReviewStatsData,
  ModerationResult,
  ReportedReviewCase,
  ProductReviewPerformance,
  VendorReviewPerformance,
  FeedbackSentimentData,
  ReviewStatus,
} from "@/types/adminReview";

let mockStats: ReviewStatsData = {
  totalReviews: 5000000,
  totalGrowth: 12.4,
  avgRating: 4.8,
  pendingCount: 2500,
  reportedCount: 300,
  removedCount: 150,
};

let mockReviews: AdminReviewModel[] = [
  {
    id: "rev_70101",
    customerName: "Elena Rostova",
    customerEmail: "elena.r@designhub.io",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    isVerifiedBuyer: true,
    productName: "MacBook Pro 16-inch M3 Max (36GB RAM, 1TB SSD)",
    productSku: "APX-M3-PRO",
    productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=150&q=80",
    vendorStore: "Apex Tech Labs",
    rating: 5,
    comment: "Absolute beast of a laptop! Renders 8K video in Premiere Pro effortlessly and battery lasts all day. Highly recommended for creative pros.",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80",
    ],
    status: "Published",
    createdAt: "2026-07-18 16:40 UTC",
  },
  {
    id: "rev_70102",
    customerName: "Alex Vance",
    customerEmail: "alex@soundcraft.com",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    isVerifiedBuyer: true,
    productName: "Quantum Noise Cancelling Wireless Headphones Gen 2",
    productSku: "QNT-ANC-900",
    productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80",
    rating: 4,
    comment: "Noise cancelling is unbelievable on flights! Sound signature is crisp with deep punchy bass. Only small complaint is the headband gets tight after 4 hours.",
    images: [],
    vendorStore: "Quantum Sound Audio",
    status: "Published",
    createdAt: "2026-07-19 01:15 UTC",
  },
  {
    id: "rev_70103",
    customerName: "Bot Account 902",
    customerEmail: "cheap_deals@spambot.net",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    isVerifiedBuyer: false,
    productName: "Aura Luxury Titanium Smartwatch",
    productSku: "AUR-SMART",
    productImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80",
    vendorStore: "Aura Wearable Tech",
    rating: 1,
    comment: "DONT BUY HERE GO TO WWW.CHEAPWATCHES.NET FOR 90% DISCOUNT CODE FREE SHIPPING!!!!",
    images: [],
    status: "Pending",
    createdAt: "2026-07-19 03:00 UTC",
  },
  {
    id: "rev_70104",
    customerName: "Jonathan Reed",
    customerEmail: "jreed@techcritique.org",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    isVerifiedBuyer: true,
    productName: "Hyperion Ergonomic Mesh Executive Office Chair",
    productSku: "HYP-CHAIR-01",
    productImage: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=150&q=80",
    vendorStore: "Hyperion Ergonomics",
    rating: 2,
    comment: "The armrest arrived with severe scratches and missing 2 screws. Disappointed given the high price point.",
    images: [],
    status: "Reported",
    createdAt: "2026-07-17 11:20 UTC",
  },
];

let mockReports: ReportedReviewCase[] = [
  {
    id: "rep_601",
    reviewId: "rev_70103",
    reporterName: "Automated AI Shield",
    reason: "Spam & External URL Violation",
    comment: "Contains prohibited promotional link to competitor website.",
    status: "Open",
    createdAt: "2 hours ago",
  },
  {
    id: "rep_602",
    reviewId: "rev_70104",
    reporterName: "Hyperion Ergonomics (Vendor)",
    reason: "Disputed Customer Claim",
    comment: "Vendor claims customer was offered free replacement hardware pack.",
    status: "Investigating",
    createdAt: "Yesterday",
  },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const adminReviewApi = {
  getReviewStats: async (): Promise<ReviewStatsData> => {
    await delay(200);
    return { ...mockStats };
  },

  getReviews: async (): Promise<AdminReviewModel[]> => {
    await delay(250);
    return [...mockReviews];
  },

  getReviewById: async (id: string): Promise<AdminReviewModel | undefined> => {
    await delay(200);
    return mockReviews.find((r) => r.id === id);
  },

  approveReview: async (id: string): Promise<AdminReviewModel> => {
    await delay(350);
    const r = mockReviews.find((rev) => rev.id === id);
    if (!r) throw new Error("Review not found");

    r.status = "Published";
    return r;
  },

  removeReview: async (id: string, reason: string): Promise<AdminReviewModel> => {
    await delay(350);
    const r = mockReviews.find((rev) => rev.id === id);
    if (!r) throw new Error("Review not found");

    r.status = "Removed";
    return r;
  },

  getAIRiskScore: async (reviewId: string): Promise<ModerationResult> => {
    await delay(200);
    if (reviewId === "rev_70103") {
      return {
        reviewId,
        riskScore: 94,
        riskLevel: "High",
        spamProbability: 98,
        fakeProbability: 89,
        offensiveLanguageDetected: false,
        duplicateContent: true,
        flags: ["External Link Detected", "Spam Keyword Pattern", "Non-Verified Buyer Account"],
      };
    }
    return {
      reviewId,
      riskScore: 4,
      riskLevel: "Low",
      spamProbability: 2,
      fakeProbability: 1,
      offensiveLanguageDetected: false,
      duplicateContent: false,
      flags: [],
    };
  },

  getReports: async (): Promise<ReportedReviewCase[]> => {
    await delay(200);
    return [...mockReports];
  },

  dismissReport: async (reportId: string): Promise<boolean> => {
    await delay(300);
    mockReports = mockReports.filter((rep) => rep.id !== reportId);
    return true;
  },

  getProductRatings: async (): Promise<ProductReviewPerformance[]> => {
    await delay(200);
    return [
      { productName: "MacBook Pro 16-inch M3 Max", vendorStore: "Apex Tech Labs", rating: 4.9, totalReviews: 1240, salesCount: 3420 },
      { productName: "Quantum Noise Cancelling Headphones", vendorStore: "Quantum Sound", rating: 4.8, totalReviews: 890, salesCount: 4890 },
      { productName: "Hyperion Ergonomic Mesh Chair", vendorStore: "Hyperion Ergo", rating: 4.2, totalReviews: 310, salesCount: 1200 },
      { productName: "Aura Luxury Smartwatch", vendorStore: "Aura Wearables", rating: 2.4, totalReviews: 85, salesCount: 420 },
    ];
  },

  getVendorRatings: async (): Promise<VendorReviewPerformance[]> => {
    await delay(200);
    return [
      { vendorStore: "Apex Tech Labs", avgRating: 4.9, totalReviews: 45000, complaintCount: 12, status: "Top Rated" },
      { vendorStore: "Quantum Sound Audio", avgRating: 4.8, totalReviews: 32000, complaintCount: 8, status: "Top Rated" },
      { vendorStore: "Hyperion Ergonomics", avgRating: 4.5, totalReviews: 14000, complaintCount: 24, status: "Good" },
      { vendorStore: "Aura Wearable Tech", avgRating: 2.8, totalReviews: 1200, complaintCount: 89, status: "Under Warning" },
    ];
  },

  getFeedbackSentiment: async (): Promise<FeedbackSentimentData> => {
    await delay(200);
    return {
      positiveKeywords: [
        { word: "fast shipping", count: 1420 },
        { word: "build quality", count: 1180 },
        { word: "excellent audio", count: 950 },
        { word: "great value", count: 820 },
      ],
      negativeKeywords: [
        { word: "delayed delivery", count: 240 },
        { word: "box damaged", count: 180 },
        { word: "missing screws", count: 95 },
      ],
      commonComplaints: ["Courier shipping delays during peak season", "Packaging box dented during transit"],
      suggestions: ["Add express 1-day shipping option for electronics", "Include spare screws in hardware chair box"],
    };
  },

  bulkApproveReviews: async (ids: string[]): Promise<boolean> => {
    await delay(400);
    mockReviews = mockReviews.map((r) => (ids.includes(r.id) ? { ...r, status: "Published" } : r));
    return true;
  },

  bulkRemoveReviews: async (ids: string[]): Promise<boolean> => {
    await delay(400);
    mockReviews = mockReviews.map((r) => (ids.includes(r.id) ? { ...r, status: "Removed" } : r));
    return true;
  },
};
