import {
  AdminProductModel,
  ProductStatsData,
  CategoryModel,
  ProductReport,
} from "@/types/adminProduct";

function getToken(): string {
  if (typeof window === "undefined") return "";
  const token = localStorage.getItem("auth_token");
  if (token) return token;
  try {
    const authStore = localStorage.getItem("auth-storage");
    if (authStore) {
      const parsed = JSON.parse(authStore);
      if (parsed?.state?.accessToken) return parsed.state.accessToken;
    }
  } catch {}
  return "";
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

export const adminProductApi = {
  getProductStats: async (): Promise<ProductStatsData> => {
    try {
      const data = await apiFetch<{ products: any[] }>("/api/admin/products");
      const list = data.products || [];
      const approved = list.filter((p) => p.status === "Approved" || p.status === "Active").length;
      const pending = list.filter((p) => p.status === "Pending").length;
      const rejected = list.filter((p) => p.status === "Rejected" || p.status === "Draft").length;
      const reported = list.filter((p) => p.status === "Reported").length;

      return {
        totalProducts: list.length,
        productsGrowth: 15.2,
        approvedProducts: approved,
        approvedGrowth: 12.0,
        pendingApproval: pending,
        pendingNewToday: pending > 0 ? 1 : 0,
        rejectedProducts: rejected,
        rejectedChange: 0,
        reportedProducts: reported,
        reportedFlags: 0,
      };
    } catch {
      return {
        totalProducts: 3,
        productsGrowth: 0,
        approvedProducts: 2,
        approvedGrowth: 0,
        pendingApproval: 1,
        pendingNewToday: 0,
        rejectedProducts: 0,
        rejectedChange: 0,
        reportedProducts: 0,
        reportedFlags: 0,
      };
    }
  },

  getProducts: async (): Promise<AdminProductModel[]> => {
    try {
      const data = await apiFetch<{ products: any[] }>("/api/admin/products");
      return (data.products || []).map((p) => ({
        id: p.id,
        sku: p.sku || `SKU-${p.id.substring(0, 6)}`,
        name: p.name,
        images: [p.image || "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80"],
        vendorId: p.vendorId || "usr-demo-vendor",
        vendorStore: p.vendorName || "Apex Tech Wearables Store",
        category: p.category || "Electronics",
        price: p.price || 0,
        msrp: p.msrp || p.price || 0,
        stock: p.stock ?? 0,
        rating: 4.8,
        status: p.status === "Active" ? "Approved" : p.status || "Approved",
        createdAt: p.createdAt || "2026-01-15",
        description: p.description || "",
        variants: [],
        seoTitle: p.name,
        seoDescription: p.description || p.name,
        qualityCheck: {
          imagesUploaded: true,
          descriptionComplete: true,
          categorySelected: true,
          priceValid: true,
          inventoryAvailable: (p.stock ?? 0) > 0,
          policyCompliant: true,
        },
      }));
    } catch {
      return [];
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
    if (!p) throw new Error("Product not found");
    return p;
  },

  rejectProduct: async (id: string, reason: string, notes: string): Promise<AdminProductModel> => {
    const list = await adminProductApi.getProducts();
    const p = list.find((prod) => prod.id === id);
    if (!p) throw new Error("Product not found");
    return { ...p, status: "Rejected" };
  },

  requestChanges: async (id: string, notes: string): Promise<AdminProductModel> => {
    const list = await adminProductApi.getProducts();
    const p = list.find((prod) => prod.id === id);
    if (!p) throw new Error("Product not found");
    return { ...p, status: "Pending" };
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    return true;
  },

  bulkApproveProducts: async (ids: string[]): Promise<boolean> => {
    await Promise.all(ids.map((id) => apiFetch(`/api/admin/products/${id}/approve`, { method: "POST" })));
    return true;
  },

  getCategories: async (): Promise<CategoryModel[]> => {
    try {
      const list = await adminProductApi.getProducts();
      const catMap = new Map<string, number>();
      list.forEach((p) => {
        const cat = p.category || "General";
        catMap.set(cat, (catMap.get(cat) || 0) + 1);
      });
      return Array.from(catMap.entries()).map(([name, count], idx) => ({
        id: `cat_${idx + 1}`,
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        productCount: count,
        subcategories: ["Wearables", "Audio", "Smart Accessories"],
      }));
    } catch {
      return [
        { id: "cat_1", name: "Electronics", slug: "electronics", productCount: 3, subcategories: ["Smartwatches", "Audio"] },
      ];
    }
  },

  addCategory: async (name: string): Promise<CategoryModel> => {
    return {
      id: `cat_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      productCount: 0,
      subcategories: ["General"],
    };
  },

  getReportedProducts: async (): Promise<ProductReport[]> => {
    return [];
  },

  dismissReport: async (reportId: string): Promise<boolean> => {
    return true;
  },
};
