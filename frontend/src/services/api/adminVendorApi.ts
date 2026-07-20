import {
  AdminVendorModel,
  VendorStatsData,
  AddVendorInput,
  VendorAnalyticsPoint,
} from "@/types/adminVendor";

let mockStats: VendorStatsData = {
  totalVendors: 12500,
  totalGrowth: 14.2,
  activeVendors: 11800,
  activeGrowth: 11.5,
  pendingApproval: 350,
  pendingNewToday: 18,
  suspendedVendors: 50,
  suspendedChange: -2.4,
};

let mockVendors: AdminVendorModel[] = [
  {
    id: "v_101",
    storeName: "Apex Tech Labs",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
    banner: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&h=300&q=80",
    ownerName: "Alexander Vance",
    email: "alexander@apextech.io",
    phone: "+1 (800) 555-0199",
    category: "Laptops & Electronics",
    rating: 4.9,
    salesCount: 14200,
    revenue: 3450000,
    ordersCount: 8900,
    status: "Approved",
    verified: true,
    verificationDetails: { identity: true, business: true, payment: true },
    joinedDate: "2023-04-12",
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
    joinedDate: "2023-08-19",
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
  {
    id: "v_104",
    storeName: "Aura Wearable Tech",
    logo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80",
    banner: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=1200&h=300&q=80",
    ownerName: "David Miller",
    email: "david@aurawearables.com",
    phone: "+1 (312) 789-0123",
    category: "Fashion & Tech",
    rating: 3.2,
    salesCount: 420,
    revenue: 89000,
    ordersCount: 310,
    status: "Suspended",
    suspensionReason: "Policy Violation - Counterfeit Brand Warning",
    verified: true,
    verificationDetails: { identity: true, business: false, payment: true },
    joinedDate: "2025-01-12",
    businessName: "Aura Wearables Ltd",
    taxId: "EIN-112049832",
    bankAccountLast4: "5521",
    businessLicenseUrl: "https://example.com/docs/license-aura.pdf",
    taxDocumentUrl: "https://example.com/docs/tax-aura.pdf",
    identityDocumentUrl: "https://example.com/docs/id-david.pdf",
  },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const adminVendorApi = {
  getVendorStats: async (): Promise<VendorStatsData> => {
    await delay(200);
    return { ...mockStats };
  },

  getVendors: async (): Promise<AdminVendorModel[]> => {
    await delay(250);
    return [...mockVendors];
  },

  getVendorById: async (id: string): Promise<AdminVendorModel | undefined> => {
    await delay(200);
    return mockVendors.find((v) => v.id === id);
  },

  approveVendor: async (id: string): Promise<AdminVendorModel> => {
    await delay(400);
    const v = mockVendors.find((vendor) => vendor.id === id);
    if (!v) throw new Error("Vendor not found");

    v.status = "Approved";
    v.verified = true;
    v.verificationDetails = { identity: true, business: true, payment: true };
    mockStats.pendingApproval = Math.max(0, mockStats.pendingApproval - 1);
    mockStats.activeVendors += 1;
    return v;
  },

  rejectVendor: async (id: string, reason: string, notes: string): Promise<AdminVendorModel> => {
    await delay(400);
    const v = mockVendors.find((vendor) => vendor.id === id);
    if (!v) throw new Error("Vendor not found");

    v.status = "Rejected";
    v.rejectionNotes = `${reason}: ${notes}`;
    mockStats.pendingApproval = Math.max(0, mockStats.pendingApproval - 1);
    return v;
  },

  suspendVendor: async (id: string, reason: string): Promise<AdminVendorModel> => {
    await delay(400);
    const v = mockVendors.find((vendor) => vendor.id === id);
    if (!v) throw new Error("Vendor not found");

    v.status = "Suspended";
    v.suspensionReason = reason;
    mockStats.activeVendors = Math.max(0, mockStats.activeVendors - 1);
    mockStats.suspendedVendors += 1;
    return v;
  },

  addVendor: async (input: AddVendorInput): Promise<AdminVendorModel> => {
    await delay(400);
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
      businessLicenseUrl: "https://example.com/docs/license-new.pdf",
      taxDocumentUrl: "https://example.com/docs/tax-new.pdf",
      identityDocumentUrl: "https://example.com/docs/id-new.pdf",
    };
    mockVendors.unshift(newVendor);
    mockStats.totalVendors += 1;
    mockStats.activeVendors += 1;
    return newVendor;
  },

  bulkApproveVendors: async (ids: string[]): Promise<boolean> => {
    await delay(400);
    mockVendors = mockVendors.map((v) =>
      ids.includes(v.id) ? { ...v, status: "Approved", verified: true } : v
    );
    return true;
  },

  getVendorAnalytics: async (id: string): Promise<VendorAnalyticsPoint[]> => {
    await delay(200);
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
