export type VendorStatus = "Approved" | "Pending" | "Rejected" | "Suspended";

export interface VerificationChecklist {
  identity: boolean;
  business: boolean;
  payment: boolean;
}

export interface AdminVendorModel {
  id: string;
  storeName: string;
  logo: string;
  banner: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  rating: number;
  salesCount: number;
  revenue: number;
  ordersCount: number;
  status: VendorStatus;
  verified: boolean;
  verificationDetails: VerificationChecklist;
  joinedDate: string;
  businessName: string;
  taxId: string;
  bankAccountLast4: string;
  businessLicenseUrl: string;
  taxDocumentUrl: string;
  identityDocumentUrl: string;
  rejectionNotes?: string;
  suspensionReason?: string;
}

export interface VendorStatsData {
  totalVendors: number;
  totalGrowth: number;
  activeVendors: number;
  activeGrowth: number;
  pendingApproval: number;
  pendingNewToday: number;
  suspendedVendors: number;
  suspendedChange: number;
}

export interface VendorFilterCriteria {
  searchQuery: string;
  statusFilter: string;
  verificationFilter: string;
  categoryFilter: string;
}

export interface AddVendorInput {
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  businessName: string;
  taxId: string;
}

export interface VendorAnalyticsPoint {
  month: string;
  revenue: number;
  orders: number;
  rating: number;
}
