"use client";

import { useAdminReviewStore } from "@/store/adminReviewStore";
import {
  useReviewStats,
  useAdminReviews,
  useBulkApproveReviews,
  useBulkRemoveReviews,
} from "@/hooks/useAdminReviewQuery";

import ReviewHeader from "@/components/AdminReviews/ReviewHeader";
import ReviewStats from "@/components/AdminReviews/ReviewStats";
import ReportedReviews from "@/components/AdminReviews/ReportedReviews";
import ReviewFilters from "@/components/AdminReviews/ReviewFilters";
import ReviewTable from "@/components/AdminReviews/ReviewTable";
import RatingAnalytics from "@/components/AdminReviews/RatingAnalytics";
import ProductRatings from "@/components/AdminReviews/ProductRatings";
import VendorRatings from "@/components/AdminReviews/VendorRatings";
import FeedbackInsights from "@/components/AdminReviews/FeedbackInsights";
import ReviewDetails from "@/components/AdminReviews/ReviewDetails";
import ApproveReviewModal from "@/components/AdminReviews/ApproveReviewModal";
import RemoveReviewModal from "@/components/AdminReviews/RemoveReviewModal";
import ReviewExportModal from "@/components/AdminReviews/ReviewExportModal";
import ReviewSkeleton from "@/components/AdminReviews/ReviewSkeleton";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminReviewsPage() {
  const {
    filters,
    selectedReviewIds,
    toggleSelectReview,
    selectAllReviews,
    clearSelection,
  } = useAdminReviewStore();

  const { data: stats, isLoading: statsLoading } = useReviewStats();
  const { data: reviews = [], isLoading: reviewsLoading, isError, refetch } = useAdminReviews();

  const bulkApproveMutation = useBulkApproveReviews();
  const bulkRemoveMutation = useBulkRemoveReviews();

  // Filter Logic
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      r.customerEmail.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      r.productName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      r.vendorStore.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesRating = filters.ratingFilter === "All" || r.rating.toString() === filters.ratingFilter;
    const matchesStatus = filters.statusFilter === "All" || r.status === filters.statusFilter;

    return matchesSearch && matchesRating && matchesStatus;
  });

  if (statsLoading || reviewsLoading || !stats) {
    return <ReviewSkeleton />;
  }

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
          Unable to Load Review Moderation Catalog
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          The Review Service & AI NLP Moderation pipeline encountered an internal RPC timeout.
        </p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <ReviewHeader />

      {/* Summary Statistics Cards */}
      <ReviewStats stats={stats} />

      {/* Reported Customer Reviews Queue */}
      <ReportedReviews />

      {/* Search & Filter Toolbar */}
      <ReviewFilters
        selectedCount={selectedReviewIds.length}
        onBulkApprove={() => {
          bulkApproveMutation.mutate(selectedReviewIds);
          clearSelection();
        }}
        onBulkRemove={() => {
          bulkRemoveMutation.mutate(selectedReviewIds);
          clearSelection();
        }}
      />

      {/* Review Data Table */}
      <ReviewTable
        reviews={filteredReviews}
        selectedIds={selectedReviewIds}
        onToggleSelect={toggleSelectReview}
        onSelectAll={selectAllReviews}
      />

      {/* Rating Analytics & Customer Feedback Sentiment Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RatingAnalytics />
        <FeedbackInsights />
      </div>

      {/* Product & Vendor Rating Performance Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductRatings />
        <VendorRatings />
      </div>

      {/* Modals & Drawers */}
      <ReviewDetails />
      <ApproveReviewModal />
      <RemoveReviewModal />
      <ReviewExportModal />
    </div>
  );
}
