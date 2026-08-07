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

  let products: any[] = [];

  try {
    await connectDB();

    const dbProducts = await VendorProduct.find().sort({ createdAt: -1 });

    products = await Promise.all(
      dbProducts.map(async (p) => {
        const store = await VendorProfile.findOne({ userId: p.vendorId }).select("storeName");
        const statusMap: Record<string, string> = {
          Active: "Approved",
          Pending: "Pending",
          Draft: "Draft",
          Rejected: "Rejected",
          Paused: "Draft",
        };

        return {
          id: p._id.toString(),
          name: p.name,
          image: p.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
          vendorId: p.vendorId,
          vendorName: store?.storeName || "Vendor Store",
          sku: p.sku,
          category: p.category,
          price: p.price,
          msrp: p.discountPrice || Math.round(p.price * 1.2),
          stock: p.stock ?? 0,
          sales: p.salesCount || 0,
          revenue: p.revenueGenerated || 0,
          views: (p as any).views || p.salesCount || 0,
          status: statusMap[p.status] || "Pending",
          createdAt: p.createdAt ? p.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          description: p.description || "",
        };
      })
    );
  } catch (err: any) {
    console.warn("Admin Products DB notice:", err?.message || err);
    products = [];
  }

  return NextResponse.json({ success: true, products: products || [] });
}


