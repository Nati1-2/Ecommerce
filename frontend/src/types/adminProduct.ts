export type ProductApprovalStatus = "Approved" | "Pending" | "Rejected" | "Draft" | "Reported";

export interface ProductQualityCheckDetails {
  imagesUploaded: boolean;
  descriptionComplete: boolean;
  categorySelected: boolean;
  priceValid: boolean;
  inventoryAvailable: boolean;
  policyCompliant: boolean;
}

export interface AdminProductVariant {
  name: string;
  options: string[];
}

export interface AdminProductModel {
  id: string;
  sku: string;
  name: string;
  images: string[];
  vendorId: string;
  vendorStore: string;
  category: string;
  price: number;
  msrp: number;
  stock: number;
  rating: number;
  status: ProductApprovalStatus;
  createdAt: string;
  description: string;
  variants: AdminProductVariant[];
  seoTitle: string;
  seoDescription: string;
  qualityCheck: ProductQualityCheckDetails;
  rejectionReason?: string;
  adminNotes?: string;
}

export interface ProductReport {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  vendorStore: string;
  reason: "Fake product" | "Copyright issue" | "Wrong information" | "Customer complaints";
  reportedBy: string;
  date: string;
}

export interface CategoryModel {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  subcategories: string[];
}

export interface ProductStatsData {
  totalProducts: number;
  productsGrowth: number;
  pendingApproval: number;
  pendingNewToday: number;
  approvedProducts: number;
  approvedGrowth: number;
  rejectedProducts: number;
  rejectedChange: number;
  reportedProducts: number;
  reportedFlags: number;
}

export interface ProductFilterCriteria {
  searchQuery: string;
  statusFilter: string;
  categoryFilter: string;
  vendorFilter: string;
  dateFilter: string;
}
