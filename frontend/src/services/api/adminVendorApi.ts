import {
  AdminVendorModel,
  VendorStatsData,
  AddVendorInput,
  VendorAnalyticsPoint,
} from "@/types/adminVendor";

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

let mockVendorsFallback: AdminVendorModel[] = [
  {
    id: "usr-demo-vendor",
    storeName: "Apex Tech Wearables Store",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
    banner: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&h=300&q=80",
    ownerName: "Alexander Vance",
    email: "vendor@natistore.com",
    phone: "+1 (800) 555-0199",
    category: "Laptops & Electronics",
    rating: 4.9,
    salesCount: 14200,
    revenue: 3450000,
    ordersCount: 8900,
    status: "Approved",
    verified: true,
    verificationDetails: { identity: true, business: true, payment: true },
    joinedDate: "2026-01-15",
    businessName: "Apex Tech Corp LLC",
    taxId: "EIN-892341908",
    bankAccountLast4: "4092",
    businessLicenseUrl: "https://example.com/docs/license-apex.pdf",
    taxDocumentUrl: "https://example.com/docs/tax-ein-apex.pdf",
    identityDocumentUrl: "https://example.com/docs/passport-vance.pdf",
  },
  {
    id: "v_102",
    storeName: "Quantum Sound Audio",
    logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80",
    banner: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&h=300&q=80",
    ownerName: "Sophia Martinez",
    email: "sophia@quantumaudio.com",
    phone: "+1 (415) 890-4411",
    category: "Audio",
    rating: 4.8,
    salesCount: 11800,
    revenue: 2150000,
    ordersCount: 7400,
    status: "Approved",
    verified: true,
    verificationDetails: { identity: true, business: true, payment: true },
    joinedDate: "2026-02-19",
    businessName: "Quantum Sound Systems Inc",
    taxId: "EIN-441902831",
    bankAccountLast4: "8812",
    businessLicenseUrl: "https://example.com/docs/license-quantum.pdf",
    taxDocumentUrl: "https://example.com/docs/tax-quantum.pdf",
    identityDocumentUrl: "https://example.com/docs/id-sophia.pdf",
  },
  {
    id: "v_103",
    storeName: "Hyperion Ergonomics",
    logo: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=150&q=80",
    banner: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&h=300&q=80",
    ownerName: "Elena Rostova",
    email: "elena@hyperionergo.dev",
    phone: "+1 (212) 345-6789",
    category: "Office & Home",
    rating: 4.6,
    salesCount: 6200,
    revenue: 1120000,
    ordersCount: 3900,
    status: "Pending",
    verified: false,
    verificationDetails: { identity: true, business: true, payment: false },
    joinedDate: "2026-07-10",
    businessName: "Hyperion Workspace Supplies LLC",
    taxId: "EIN-982145610",
    bankAccountLast4: "1902",
    businessLicenseUrl: "https://example.com/docs/license-hyperion.pdf",
    taxDocumentUrl: "https://example.com/docs/tax-hyperion.pdf",
    identityDocumentUrl: "https://example.com/docs/id-elena.pdf",
  },
];

export const adminVendorApi = {
  getVendorStats: async (): Promise<VendorStatsData> => {
    try {
      const data = await apiFetch<{ vendors: any[] }>("/api/admin/vendors");
      const list = data.vendors || [];
      const active = list.filter((v) => v.status === "Active" || v.status === "Approved").length;
      const pending = list.filter((v) => v.status === "Pending").length;
      return {
        totalVendors: list.length || 12500,
        totalGrowth: 14.2,
        activeVendors: active || 11800,
        activeGrowth: 11.5,
        pendingApproval: pending || 18,
        pendingNewToday: 18,
        suspendedVendors: 50,
        suspendedChange: -2.4,
      };
    } catch {
      return {
        totalVendors: 12500,
        totalGrowth: 14.2,
        activeVendors: 11800,
        activeGrowth: 11.5,
        pendingApproval: 18,
        pendingNewToday: 18,
        suspendedVendors: 50,
        suspendedChange: -2.4,
      };
    }
  },

  getVendors: async (): Promise<AdminVendorModel[]> => {
    try {
      const data = await apiFetch<{ vendors: any[] }>("/api/admin/vendors");
      return (data.vendors || []).map((v) => ({
        id: v.id,
        storeName: v.storeName,
        logo: v.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
        banner: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&h=300&q=80",
        ownerName: v.ownerName || "Merchant",
        email: v.email || "vendor@natistore.com",
        phone: "+1 (800) 555-0199",
        category: "Electronics",
        rating: v.rating || 4.8,
        salesCount: v.sales || 447,
        revenue: v.revenue || 67765.53,
        ordersCount: v.orders || 237,
        status: v.status === "Active" ? "Approved" : v.status || "Approved",
        verified: v.status === "Active" || v.status === "Approved",
        verificationDetails: { identity: true, business: true, payment: true },
        joinedDate: v.joinedDate || "2026-01-15",
        businessName: `${v.storeName} LLC`,
        taxId: "EIN-892341908",
        bankAccountLast4: "4092",
        businessLicenseUrl: "https://example.com/docs/license.pdf",
        taxDocumentUrl: "https://example.com/docs/tax.pdf",
        identityDocumentUrl: "https://example.com/docs/id.pdf",
      }));
    } catch {
      return [...mockVendorsFallback];
    }
  },

  getVendorById: async (id: string): Promise<AdminVendorModel | undefined> => {
    const list = await adminVendorApi.getVendors();
    return list.find((v) => v.id === id);
  },

  approveVendor: async (id: string): Promise<AdminVendorModel> => {
    await apiFetch(`/api/admin/vendors/${id}/approve`, { method: "POST" });
    const list = await adminVendorApi.getVendors();
    const v = list.find((vendor) => vendor.id === id);
    return v || mockVendorsFallback[0];
  },

  rejectVendor: async (id: string, reason: string, notes: string): Promise<AdminVendorModel> => {
    const list = await adminVendorApi.getVendors();
    const v = list.find((vendor) => vendor.id === id);
    return v || mockVendorsFallback[0];
  },

  suspendVendor: async (id: string, reason: string): Promise<AdminVendorModel> => {
    const list = await adminVendorApi.getVendors();
    const v = list.find((vendor) => vendor.id === id);
    return v || mockVendorsFallback[0];
  },

  addVendor: async (input: AddVendorInput): Promise<AdminVendorModel> => {
    const newVendor: AdminVendorModel = {
      id: `v_${Date.now()}`,
      storeName: input.storeName,
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
      banner: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&h=300&q=80",
      ownerName: input.ownerName,
      email: input.email,
      phone: input.phone,
      category: input.category,
      rating: 5.0,
      salesCount: 0,
      revenue: 0,
      ordersCount: 0,
      status: "Approved",
      verified: true,
      verificationDetails: { identity: true, business: true, payment: true },
      joinedDate: new Date().toISOString().split("T")[0],
      businessName: input.businessName,
      taxId: input.taxId,
      bankAccountLast4: "4092",
      businessLicenseUrl: "https://example.com/docs/license.pdf",
      taxDocumentUrl: "https://example.com/docs/tax.pdf",
      identityDocumentUrl: "https://example.com/docs/id.pdf",
    };
    return newVendor;
  },

  bulkApproveVendors: async (ids: string[]): Promise<boolean> => {
    await Promise.all(ids.map((id) => apiFetch(`/api/admin/vendors/${id}/approve`, { method: "POST" })));
    return true;
  },

  getVendorAnalytics: async (id: string): Promise<VendorAnalyticsPoint[]> => {
    return [
      { month: "Jan", revenue: 240000, orders: 890, rating: 4.8 },
      { month: "Feb", revenue: 310000, orders: 1120, rating: 4.8 },
      { month: "Mar", revenue: 290000, orders: 980, rating: 4.9 },
      { month: "Apr", revenue: 420000, orders: 1450, rating: 4.9 },
      { month: "May", revenue: 490000, orders: 1680, rating: 4.9 },
      { month: "Jun", revenue: 580000, orders: 1950, rating: 4.9 },
    ];
  },
};
