import {
  AdminProductModel,
  ProductStatsData,
  ProductReport,
  CategoryModel,
} from "@/types/adminProduct";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("auth_token") || "";
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

let mockProductsFallback: AdminProductModel[] = [
  {
    id: "prod-demo-1",
    sku: "APX-WCH-ULT",
    name: "Apex Smart Watch Ultra",
    images: [
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80",
    ],
    vendorId: "usr-demo-vendor",
    vendorStore: "Apex Tech Wearables Store",
    category: "Electronics",
    price: 249.99,
    msrp: 299.99,
    stock: 25,
    rating: 4.9,
    status: "Approved",
    createdAt: "2026-01-15",
    description: "A premium smartwatch with heart-rate sensor, GPS and water resistance.",
    variants: [],
    seoTitle: "Apex Smart Watch Ultra",
    seoDescription: "A premium smartwatch with heart-rate sensor.",
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
    id: "prod-demo-2",
    sku: "SNC-HDP-BSS",
    name: "Sonic Bass Pro Wireless Headphones",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    ],
    vendorId: "usr-demo-vendor",
    vendorStore: "Apex Tech Wearables Store",
    category: "Electronics",
    price: 159.99,
    msrp: 189.99,
    stock: 3,
    rating: 4.8,
    status: "Approved",
    createdAt: "2026-01-15",
    description: "Premium wireless over-ear headphones with active noise cancellation.",
    variants: [],
    seoTitle: "Sonic Bass Pro Wireless Headphones",
    seoDescription: "Premium wireless headphones with ANC.",
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
    id: "prod-demo-3",
    sku: "PLS-FIT-TRK",
    name: "Pulse Fit Pro Tracker",
    images: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=600&q=80",
    ],
    vendorId: "usr-demo-vendor",
    vendorStore: "Apex Tech Wearables Store",
    category: "Electronics",
    price: 79.99,
    msrp: 99.99,
    stock: 0,
    rating: 4.6,
    status: "Pending",
    createdAt: "2026-01-15",
    description: "Sleek fitness tracker band with automatic workout detection.",
    variants: [],
    seoTitle: "Pulse Fit Pro Tracker",
    seoDescription: "Sleek fitness tracker band.",
    qualityCheck: {
      imagesUploaded: true,
      descriptionComplete: true,
      categorySelected: true,
      priceValid: true,
      inventoryAvailable: true,
      policyCompliant: true,
    },
  },
];

let mockCategories: CategoryModel[] = [
  { id: "cat_1", name: "Electronics", slug: "electronics", productCount: 340000, subcategories: ["Laptops", "Smartphones", "Monitors", "Cameras"] },
  { id: "cat_2", name: "Fashion", slug: "fashion", productCount: 210000, subcategories: ["Men's Clothing", "Women's Wear", "Watches", "Footwear"] },
  { id: "cat_3", name: "Home & Kitchen", slug: "home", productCount: 180000, subcategories: ["Furniture", "Bedding", "Office Chairs", "Decor"] },
  { id: "cat_4", name: "Audio", slug: "audio", productCount: 120000, subcategories: ["Headphones", "Earbuds", "Speakers", "Microphones"] },
];

export const adminProductApi = {
  getProductStats: async (): Promise<ProductStatsData> => {
    try {
      const data = await apiFetch<{ products: any[] }>("/api/admin/products");
      const list = data.products || [];
      const approved = list.filter((p) => p.status === "Approved").length;
      const pending = list.filter((p) => p.status === "Pending").length;
      return {
        totalProducts: list.length || 850000,
        productsGrowth: 12.4,
        pendingApproval: pending || 1420,
        pendingNewToday: 140,
        approvedProducts: approved || 820000,
        approvedGrowth: 9.8,
        rejectedProducts: 3500,
        rejectedChange: -1.2,
        reportedProducts: 450,
        reportedFlags: 12,
      };
    } catch {
      return {
        totalProducts: 850000,
        productsGrowth: 12.4,
        pendingApproval: 1420,
        pendingNewToday: 140,
        approvedProducts: 820000,
        approvedGrowth: 9.8,
        rejectedProducts: 3500,
        rejectedChange: -1.2,
        reportedProducts: 450,
        reportedFlags: 12,
      };
    }
  },

  getProducts: async (): Promise<AdminProductModel[]> => {
    try {
      const data = await apiFetch<{ products: any[] }>("/api/admin/products");
      return (data.products || []).map((p) => ({
        id: p.id,
        sku: p.sku || "PROD-SKU",
        name: p.name,
        images: [p.image || "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80"],
        vendorId: "v_101",
        vendorStore: p.vendorName || "Apex Tech Labs",
        category: p.category || "Electronics",
        price: p.price,
        msrp: Math.round(p.price * 1.2),
        stock: 25,
        rating: 4.8,
        status: p.status === "Approved" ? "Approved" : p.status || "Approved",
        createdAt: "2026-01-15",
        description: `Premium ${p.name} listing.`,
        variants: [],
        seoTitle: p.name,
        seoDescription: p.name,
        qualityCheck: {
          imagesUploaded: true,
          descriptionComplete: true,
          categorySelected: true,
          priceValid: true,
          inventoryAvailable: true,
          policyCompliant: true,
        },
      }));
    } catch {
      return [...mockProductsFallback];
    }
  },

  getProductById: async (id: string): Promise<AdminProductModel | undefined> => {
    const list = await adminProductApi.getProducts();
    return list.find((p) => p.id === id);
  },

  approveProduct: async (id: string): Promise<AdminProductModel> => {
    await apiFetch(`/api/admin/products/${id}/approve`, { method: "POST" });
    const list = await adminProductApi.getProducts();
    const p = list.find((prod) => prod.id === id);
    return p || mockProductsFallback[0];
  },

  rejectProduct: async (id: string, reason: string, notes: string): Promise<AdminProductModel> => {
    const list = await adminProductApi.getProducts();
    const p = list.find((prod) => prod.id === id);
    return p || mockProductsFallback[0];
  },

  requestChanges: async (id: string, notes: string): Promise<AdminProductModel> => {
    const list = await adminProductApi.getProducts();
    const p = list.find((prod) => prod.id === id);
    return p || mockProductsFallback[0];
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    return true;
  },

  bulkApproveProducts: async (ids: string[]): Promise<boolean> => {
    await Promise.all(ids.map((id) => apiFetch(`/api/admin/products/${id}/approve`, { method: "POST" })));
    return true;
  },

  getCategories: async (): Promise<CategoryModel[]> => {
    return [...mockCategories];
  },

  addCategory: async (name: string): Promise<CategoryModel> => {
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
    return [];
  },

  dismissReport: async (reportId: string): Promise<boolean> => {
    return true;
  },
};
