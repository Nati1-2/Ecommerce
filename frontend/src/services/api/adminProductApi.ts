import {
  AdminProductModel,
  ProductStatsData,
  ProductReport,
  CategoryModel,
} from "@/types/adminProduct";

let mockStats: ProductStatsData = {
  totalProducts: 850000,
  productsGrowth: 12.4,
  pendingApproval: 5200,
  pendingNewToday: 140,
  approvedProducts: 820000,
  approvedGrowth: 9.8,
  rejectedProducts: 3500,
  rejectedChange: -1.2,
  reportedProducts: 450,
  reportedFlags: 12,
};

let mockProducts: AdminProductModel[] = [
  {
    id: "prod_1001",
    sku: "APX-M3-PRO-512",
    name: "MacBook Pro 16-inch M3 Max (36GB RAM, 1TB SSD)",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80",
    ],
    vendorId: "v_101",
    vendorStore: "Apex Tech Labs",
    category: "Electronics",
    price: 3499.00,
    msrp: 3699.00,
    stock: 45,
    rating: 4.9,
    status: "Approved",
    createdAt: "2026-07-15",
    description: "The ultimate pro laptop featuring Apple M3 Max silicon with 16-core CPU and 40-core GPU. Liquid Retina XDR display with up to 22 hours battery life.",
    variants: [
      { name: "Color", options: ["Space Black", "Silver"] },
      { name: "RAM", options: ["36GB", "48GB", "128GB"] },
    ],
    seoTitle: "Buy MacBook Pro M3 Max - Apex Tech Labs",
    seoDescription: "Official Apple MacBook Pro M3 Max 16-inch with 1TB SSD storage and Liquid Retina XDR screen.",
    qualityCheck: {
      imagesUploaded: true,
      descriptionComplete: true,
      categorySelected: true,
      priceValid: true,
      inventoryAvailable: true,
      policyCompliant: true,
    },
  },
  {
    id: "prod_1002",
    sku: "QNT-ANC-900",
    name: "Quantum Noise Cancelling Wireless Headphones Gen 2",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
    ],
    vendorId: "v_102",
    vendorStore: "Quantum Sound Audio",
    category: "Audio",
    price: 349.50,
    msrp: 399.00,
    stock: 120,
    rating: 4.8,
    status: "Pending",
    createdAt: "2026-07-18",
    description: "Industry leading hybrid active noise cancellation with 40mm beryllium drivers and 60-hour playtime.",
    variants: [
      { name: "Color", options: ["Matte Black", "Midnight Navy", "Sandstone"] },
    ],
    seoTitle: "Quantum ANC Wireless Headphones - Premium Audio",
    seoDescription: "High-resolution wireless audio headphones with lossless Bluetooth 5.4 support.",
    qualityCheck: {
      imagesUploaded: true,
      descriptionComplete: true,
      categorySelected: true,
      priceValid: true,
      inventoryAvailable: true,
      policyCompliant: true,
    },
  },
  {
    id: "prod_1003",
    sku: "HYP-CHAIR-X",
    name: "Hyperion Ergonomic Mesh Executive Office Chair",
    images: [
      "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=600&q=80",
    ],
    vendorId: "v_103",
    vendorStore: "Hyperion Ergonomics",
    category: "Home",
    price: 649.00,
    msrp: 799.00,
    stock: 28,
    rating: 4.6,
    status: "Pending",
    createdAt: "2026-07-17",
    description: "Fully adjustable lumbar support mesh task chair engineered for 12+ hour daily posture alignment.",
    variants: [
      { name: "Frame", options: ["Graphite", "Polished Aluminum"] },
    ],
    seoTitle: "Hyperion Ergonomic Office Chair - Premium Mesh",
    seoDescription: "Spinal lumbar ergonomics task chair with dynamic headrest and 4D armrests.",
    qualityCheck: {
      imagesUploaded: true,
      descriptionComplete: true,
      categorySelected: true,
      priceValid: true,
      inventoryAvailable: true,
      policyCompliant: true,
    },
  },
  {
    id: "prod_1004",
    sku: "AUR-SMART-V3",
    name: "Aura Luxury Titanium Smartwatch (Reported Flag)",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    ],
    vendorId: "v_104",
    vendorStore: "Aura Wearable Tech",
    category: "Fashion",
    price: 49.00,
    msrp: 499.00,
    stock: 500,
    rating: 2.1,
    status: "Reported",
    createdAt: "2026-07-12",
    description: "Luxury titanium smartwatch with sapphire crystal glass and cardiac ECG sensor.",
    variants: [{ name: "Strap", options: ["Leather", "Silicone"] }],
    seoTitle: "Aura Smartwatch - Discounted",
    seoDescription: "Smartwatch with biometric sensors.",
    qualityCheck: {
      imagesUploaded: true,
      descriptionComplete: false,
      categorySelected: true,
      priceValid: false,
      inventoryAvailable: true,
      policyCompliant: false,
    },
    rejectionReason: "Copyright Violation - Unauthorized Apple Watch Ultra Logo Reproduction",
  },
];

let mockReports: ProductReport[] = [
  {
    id: "rep_501",
    productId: "prod_1004",
    productName: "Aura Luxury Titanium Smartwatch",
    productImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80",
    vendorStore: "Aura Wearable Tech",
    reason: "Copyright issue",
    reportedBy: "Apple Inc Legal (IP Enforcement)",
    date: "2 hours ago",
  },
  {
    id: "rep_502",
    productId: "prod_1009",
    productName: "Fake Designer Leather Bag",
    productImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80",
    vendorStore: "Luxury Replica Outlet",
    reason: "Fake product",
    reportedBy: "Customer Security Protection Bot",
    date: "5 hours ago",
  },
];

let mockCategories: CategoryModel[] = [
  { id: "cat_1", name: "Electronics", slug: "electronics", productCount: 340000, subcategories: ["Laptops", "Smartphones", "Monitors", "Cameras"] },
  { id: "cat_2", name: "Fashion", slug: "fashion", productCount: 210000, subcategories: ["Men's Clothing", "Women's Wear", "Watches", "Footwear"] },
  { id: "cat_3", name: "Home & Kitchen", slug: "home", productCount: 180000, subcategories: ["Furniture", "Bedding", "Office Chairs", "Decor"] },
  { id: "cat_4", name: "Audio", slug: "audio", productCount: 120000, subcategories: ["Headphones", "Earbuds", "Speakers", "Microphones"] },
  { id: "cat_5", name: "Gaming", slug: "gaming", productCount: 95000, subcategories: ["Consoles", "Keyboards", "Mice", "VR Headsets"] },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const adminProductApi = {
  getProductStats: async (): Promise<ProductStatsData> => {
    await delay(200);
    return { ...mockStats };
  },

  getProducts: async (): Promise<AdminProductModel[]> => {
    await delay(250);
    return [...mockProducts];
  },

  getProductById: async (id: string): Promise<AdminProductModel | undefined> => {
    await delay(200);
    return mockProducts.find((p) => p.id === id);
  },

  approveProduct: async (id: string): Promise<AdminProductModel> => {
    await delay(400);
    const p = mockProducts.find((prod) => prod.id === id);
    if (!p) throw new Error("Product not found");

    p.status = "Approved";
    mockStats.pendingApproval = Math.max(0, mockStats.pendingApproval - 1);
    mockStats.approvedProducts += 1;
    return p;
  },

  rejectProduct: async (id: string, reason: string, notes: string): Promise<AdminProductModel> => {
    await delay(400);
    const p = mockProducts.find((prod) => prod.id === id);
    if (!p) throw new Error("Product not found");

    p.status = "Rejected";
    p.rejectionReason = reason;
    p.adminNotes = notes;
    mockStats.pendingApproval = Math.max(0, mockStats.pendingApproval - 1);
    mockStats.rejectedProducts += 1;
    return p;
  },

  requestChanges: async (id: string, notes: string): Promise<AdminProductModel> => {
    await delay(400);
    const p = mockProducts.find((prod) => prod.id === id);
    if (!p) throw new Error("Product not found");

    p.status = "Draft";
    p.adminNotes = notes;
    return p;
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    await delay(400);
    mockProducts = mockProducts.filter((p) => p.id !== id);
    mockStats.totalProducts = Math.max(0, mockStats.totalProducts - 1);
    return true;
  },

  bulkApproveProducts: async (ids: string[]): Promise<boolean> => {
    await delay(400);
    mockProducts = mockProducts.map((p) => (ids.includes(p.id) ? { ...p, status: "Approved" } : p));
    return true;
  },

  getCategories: async (): Promise<CategoryModel[]> => {
    await delay(200);
    return [...mockCategories];
  },

  addCategory: async (name: string): Promise<CategoryModel> => {
    await delay(300);
    const newCat: CategoryModel = {
      id: `cat_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      productCount: 0,
      subcategories: ["General"],
    };
    mockCategories.push(newCat);
    return newCat;
  },

  getReportedProducts: async (): Promise<ProductReport[]> => {
    await delay(200);
    return [...mockReports];
  },

  dismissReport: async (reportId: string): Promise<boolean> => {
    await delay(300);
    mockReports = mockReports.filter((r) => r.id !== reportId);
    return true;
  },
};
