import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { VendorProfile } from "@/models/VendorProfile";
import { VendorProduct } from "@/models/VendorProduct";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
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
            logo: p.logo || "",
            ownerName: p.email ? p.email.split("@")[0] : "Merchant",
            email: p.email,
            sales,
            revenue: Math.round(revenue * 100) / 100 || 0,
            rating: p.rating ?? 0,
            orders: sales || 0,
            joinedDate:
              p.joinedDate ||
              (p.createdAt ? new Date(p.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]),
            status: p.verified ? "Active" : "Pending",
            verified: p.verified,
          };
        })
      );
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Unable to load vendors" }, { status: 503 });
  }

  const vendors = dbVendors.map((v) => ({
    ...v,
    category: v.category || "",
    salesCount: v.salesCount ?? v.sales ?? 0,
    ordersCount: v.ordersCount ?? v.orders ?? 0,
    sales: v.sales ?? v.salesCount ?? 0,
    orders: v.orders ?? v.ordersCount ?? 0,
    status: v.status,
    verificationDetails: v.verificationDetails || {
      identity: false,
      business: false,
      payment: false,
    },
    businessName: v.businessName || v.storeName,
    taxId: v.taxId || "",
    bankAccountLast4: v.bankAccountLast4 || "",
  }));

  return NextResponse.json({ success: true, vendors });
}
