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
    {
      const data = await apiFetch<{ products: any[] }>("/api/admin/products");
      const list = data.products || [];
      const approved = list.filter((p) => p.status === "Approved" || p.status === "Active").length;
      const pending = list.filter((p) => p.status === "Pending").length;
      const rejected = list.filter((p) => p.status === "Rejected" || p.status === "Draft").length;
      const reported = list.filter((p) => p.status === "Reported").length;

      return {
        totalProducts: list.length,
        productsGrowth: 0,
        approvedProducts: approved,
        approvedGrowth: 0,
        pendingApproval: pending,
        pendingNewToday: list.filter((p) => p.status === "Pending" && p.createdAt === new Date().toISOString().slice(0, 10)).length,
        rejectedProducts: rejected,
        rejectedChange: 0,
        reportedProducts: reported,
        reportedFlags: 0,
      };
    }
  },

  getProducts: async (): Promise<AdminProductModel[]> => {
    {
      const data = await apiFetch<{ products: any[] }>("/api/admin/products");
      return (data.products || []).map((p) => ({
        id: p.id,
        sku: p.sku || "",
        name: p.name,
        images: p.images || (p.image ? [p.image] : []),
        vendorId: p.vendorId || "",
        vendorStore: p.vendorName || "",
        category: p.category || "",
        price: p.price || 0,
        msrp: p.msrp || p.price || 0,
        stock: p.stock ?? 0,
        rating: p.rating ?? 0,
        status: p.status === "Active" ? "Approved" : p.status || "Pending",
        createdAt: p.createdAt || "",
        description: p.description || "",
        variants: p.variants || [],
        seoTitle: p.name,
        seoDescription: p.description || p.name,
        qualityCheck: {
          imagesUploaded: Boolean(p.images?.length || p.image),
          descriptionComplete: Boolean(p.description),
          categorySelected: Boolean(p.category),
          priceValid: Number.isFinite(p.price) && p.price >= 0,
          inventoryAvailable: (p.stock ?? 0) > 0,
          policyCompliant: false,
        },
      }));
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
    await apiFetch("/api/admin/products", {
      method: "PATCH",
      body: JSON.stringify({ id, status: "Rejected", message: [reason, notes].filter(Boolean).join(": ") }),
    });
    const list = await adminProductApi.getProducts();
    const p = list.find((prod) => prod.id === id);
    if (!p) throw new Error("Product not found");
    return p;
  },

  requestChanges: async (id: string, notes: string): Promise<AdminProductModel> => {
    await apiFetch("/api/admin/products", {
      method: "PATCH",
      body: JSON.stringify({ id, status: "Pending", message: notes }),
    });
    const list = await adminProductApi.getProducts();
    const p = list.find((prod) => prod.id === id);
    if (!p) throw new Error("Product not found");
    return p;
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    await apiFetch(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    return true;
  },

  bulkApproveProducts: async (ids: string[]): Promise<boolean> => {
    await Promise.all(ids.map((id) => apiFetch(`/api/admin/products/${id}/approve`, { method: "POST" })));
    return true;
  },

  getCategories: async (): Promise<CategoryModel[]> => {
    {
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
        subcategories: [],
      }));
    }
  },

  addCategory: async (name: string): Promise<CategoryModel> => {
    throw new Error("Category creation is not connected to the catalog service.");
  },

  getReportedProducts: async (): Promise<ProductReport[]> => {
    return [];
  },

  dismissReport: async (reportId: string): Promise<boolean> => {
    throw new Error("Product report moderation is not connected to a persistent service.");
  },
};
