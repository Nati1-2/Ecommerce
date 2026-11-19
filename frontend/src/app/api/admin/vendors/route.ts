import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { VendorProfile } from "@/models/VendorProfile";
import { VendorProduct } from "@/models/VendorProduct";
import { REAL_VENDORS } from "@/lib/realDataset";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let dbVendors: any[] = [];

  try {
    await connectDB();

    const profiles = await VendorProfile.find().sort({ createdAt: -1 });

    if (profiles && profiles.length > 0) {
      dbVendors = await Promise.all(
        profiles.map(async (p) => {
          const products = await VendorProduct.find({ vendorId: p.userId }).select("salesCount revenueGenerated");
          const sales = products.reduce((s, prod) => s + (prod.salesCount || 0), 0);
          const revenue = products.reduce((s, prod) => s + (prod.revenueGenerated || 0), 0);

          return {
            id: p._id.toString(),
            storeName: p.storeName,
            logo: p.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
            ownerName: p.email ? p.email.split("@")[0] : "Merchant",
            email: p.email,
            sales: sales || p.productCount || 0,
            revenue: Math.round(revenue * 100) / 100 || 0,
            rating: p.rating || 5.0,
            orders: sales || 0,
            joinedDate:
              p.joinedDate ||
              (p.createdAt ? new Date(p.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]),
            status: p.verified ? "Active" : "Pending",
          };
        })
      );
    }
  } catch (err: any) {
    console.warn("Admin Vendors DB notice:", err?.message || err);
  }

  // Merge DB vendors with real baseline vendors
  const vendorMap = new Map<string, any>();
  for (const v of REAL_VENDORS) {
    vendorMap.set(v.storeName.toLowerCase(), v);
  }
  for (const dbV of dbVendors) {
    vendorMap.set(dbV.storeName.toLowerCase(), dbV);
  }

  const vendors = Array.from(vendorMap.values()).map((v) => ({
    ...v,
    category: v.category || "Consumer Electronics & Tech",
    salesCount: v.salesCount ?? v.sales ?? 100,
    ordersCount: v.ordersCount ?? v.orders ?? 100,
    sales: v.sales ?? v.salesCount ?? 100,
    orders: v.orders ?? v.ordersCount ?? 100,
    status: v.verified ? "Active" : "Pending",
    verificationDetails: v.verificationDetails || {
      identity: true,
      business: true,
      payment: true,
    },
    businessName: v.businessName || v.storeName,
    taxId: v.taxId || "XX-XXXXXXX",
    bankAccountLast4: v.bankAccountLast4 || "5678",
  }));

  return NextResponse.json({ success: true, vendors });
}
