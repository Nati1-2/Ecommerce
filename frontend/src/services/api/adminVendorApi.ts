import type {
  AdminVendorModel, VendorStatsData, AddVendorInput, VendorAnalyticsPoint,
} from "@/types/adminVendor";

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options, headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function getVendors(): Promise<AdminVendorModel[]> {
  const data = await apiFetch<{ vendors: Array<Omit<AdminVendorModel, "status"> & { status: AdminVendorModel["status"] | "Active" }> }>("/api/admin/vendors");
  return data.vendors.map((vendor) => ({
    ...vendor,
    logo: vendor.logo || "", banner: vendor.banner || "",
    ownerName: vendor.ownerName || "", phone: vendor.phone || "",
    category: vendor.category || "", rating: vendor.rating ?? 0,
    status: vendor.status === "Active" ? "Approved" : vendor.status || "Pending",
    verified: vendor.verified ?? false,
    verificationDetails: vendor.verificationDetails || { identity: false, business: false, payment: false },
    businessName: vendor.businessName || vendor.storeName,
    taxId: vendor.taxId || "", bankAccountLast4: vendor.bankAccountLast4 || "",
    businessLicenseUrl: vendor.businessLicenseUrl || "",
    taxDocumentUrl: vendor.taxDocumentUrl || "", identityDocumentUrl: vendor.identityDocumentUrl || "",
  }));
}

export const adminVendorApi = {
  getVendorStats: async (): Promise<VendorStatsData> => {
    const vendors = await getVendors();
    return {
      totalVendors: vendors.length, totalGrowth: 0,
      activeVendors: vendors.filter((vendor) => vendor.status === "Approved").length,
      activeGrowth: 0,
      pendingApproval: vendors.filter((vendor) => vendor.status === "Pending").length,
      pendingNewToday: vendors.filter((vendor) =>
        vendor.status === "Pending" && vendor.joinedDate === new Date().toISOString().slice(0, 10)).length,
      suspendedVendors: vendors.filter((vendor) => vendor.status === "Suspended").length,
      suspendedChange: 0,
    };
  },
  getVendors,
  getVendorById: async (id: string): Promise<AdminVendorModel | undefined> =>
    (await getVendors()).find((vendor) => vendor.id === id),
  approveVendor: async (id: string): Promise<AdminVendorModel> => {
    await apiFetch(`/api/admin/vendors/${id}/approve`, { method: "POST" });
    const vendor = (await getVendors()).find((item) => item.id === id);
    if (!vendor) throw new Error("Approved vendor not found");
    return vendor;
  },
  rejectVendor: async (_id: string, _reason: string, _notes: string): Promise<AdminVendorModel> => {
    throw new Error("Vendor rejection is not connected to a persistent service.");
  },
  suspendVendor: async (_id: string, _reason: string): Promise<AdminVendorModel> => {
    throw new Error("Vendor suspension is not connected to a persistent service.");
  },
  addVendor: async (_input: AddVendorInput): Promise<AdminVendorModel> => {
    throw new Error("Vendor creation is not connected to a persistent service.");
  },
  bulkApproveVendors: async (ids: string[]): Promise<boolean> => {
    await Promise.all(ids.map((id) => apiFetch(`/api/admin/vendors/${id}/approve`, { method: "POST" })));
    return true;
  },
  getVendorAnalytics: async (_id: string): Promise<VendorAnalyticsPoint[]> => [],
  getVendorPerformance: async (_id: string): Promise<VendorAnalyticsPoint[]> => [],
};
