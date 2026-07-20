"use client";

import { useAdminVendorStore } from "@/store/adminVendorStore";
import {
  useVendorStats,
  useAdminVendors,
  useBulkApproveVendors,
} from "@/hooks/useAdminVendorQuery";

import VendorHeader from "@/components/AdminVendors/VendorHeader";
import VendorStats from "@/components/AdminVendors/VendorStats";
import TopVendors from "@/components/AdminVendors/TopVendors";
import VendorFilters from "@/components/AdminVendors/VendorFilters";
import VendorTable from "@/components/AdminVendors/VendorTable";
import VendorReviewDrawer from "@/components/AdminVendors/VendorReviewDrawer";
import VendorApprovalModal from "@/components/AdminVendors/VendorApprovalModal";
import VendorRejectModal from "@/components/AdminVendors/VendorRejectModal";
import VendorSuspendModal from "@/components/AdminVendors/VendorSuspendModal";
import VendorProfile from "@/components/AdminVendors/VendorProfile";
import AddVendorModal from "@/components/AdminVendors/AddVendorModal";
import VendorExportModal from "@/components/AdminVendors/VendorExportModal";
import VendorSkeleton from "@/components/AdminVendors/VendorSkeleton";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminVendorsPage() {
  const {
    filters,
    selectedVendorIds,
    toggleSelectVendor,
    selectAllVendors,
    clearSelection,
    setProfileModalVendor,
  } = useAdminVendorStore();

  const { data: stats, isLoading: statsLoading } = useVendorStats();
  const { data: vendors = [], isLoading: vendorsLoading, isError, refetch } = useAdminVendors();

  const bulkApproveMutation = useBulkApproveVendors();

  // Filtering Logic
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.storeName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesStatus = filters.statusFilter === "All" || v.status === filters.statusFilter;

    const matchesVerification =
      filters.verificationFilter === "All"
        ? true
        : filters.verificationFilter === "Verified"
        ? v.verified
        : !v.verified;

    const matchesCategory = filters.categoryFilter === "All" || v.category === filters.categoryFilter;

    return matchesSearch && matchesStatus && matchesVerification && matchesCategory;
  });

  if (statsLoading || vendorsLoading || !stats) {
    return <VendorSkeleton />;
  }

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
          Unable to Load Vendor Registry
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          The Vendor Service gateway is currently performing routine cache re-indexing.
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
      <VendorHeader />

      {/* Summary Statistics */}
      <VendorStats stats={stats} />

      {/* Top Revenue Leaders Widget */}
      <TopVendors vendors={vendors} onSelectVendor={(v) => setProfileModalVendor(v)} />

      {/* Search & Filter Toolbar */}
      <VendorFilters
        selectedCount={selectedVendorIds.length}
        onBulkApprove={() => {
          bulkApproveMutation.mutate(selectedVendorIds);
          clearSelection();
        }}
      />

      {/* Vendor Table */}
      <VendorTable
        vendors={filteredVendors}
        selectedIds={selectedVendorIds}
        onToggleSelect={toggleSelectVendor}
        onSelectAll={selectAllVendors}
      />

      {/* Modals & Drawers */}
      <VendorReviewDrawer />
      <VendorApprovalModal />
      <VendorRejectModal />
      <VendorSuspendModal />
      <VendorProfile />
      <AddVendorModal />
      <VendorExportModal />
    </div>
  );
}
