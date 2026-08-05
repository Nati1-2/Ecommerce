import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { VendorProduct } from "@/models/VendorProduct";
import { VendorProfile } from "@/models/VendorProfile";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    await connectDB();

    const dbProducts = await VendorProduct.find().sort({ createdAt: -1 });

    const products = await Promise.all(
      dbProducts.map(async (p) => {
        // Find store name
        const store = await VendorProfile.findOne({ userId: p.vendorId }).select("storeName");
        const statusMap: Record<string, string> = {
          Active: "Approved",
          Pending: "Pending",
          Draft: "Draft",
          Rejected: "Draft",
        };

        return {
          id: p._id.toString(),
          name: p.name,
          image: p.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
          vendorName: store?.storeName || "Apex Tech Labs",
          sku: p.sku,
          category: p.category,
          price: p.price,
          sales: p.salesCount || 0,
          revenue: p.revenueGenerated || 0,
          views: (p.salesCount || 0) * 12 + 10,
          status: statusMap[p.status] || "Pending",
        };
      })
    );

    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}
