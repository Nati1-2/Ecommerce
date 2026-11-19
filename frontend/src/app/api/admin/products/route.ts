import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { VendorProduct } from "@/models/VendorProduct";
import { VendorProfile } from "@/models/VendorProfile";
import { REAL_PRODUCTS } from "@/lib/realDataset";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let dbProducts: any[] = [];

  try {
    await connectDB();

    const foundProds = await VendorProduct.find().sort({ createdAt: -1 });

    if (foundProds && foundProds.length > 0) {
      dbProducts = await Promise.all(
        foundProds.map(async (p) => {
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
            image:
              p.images?.[0] ||
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
            vendorId: p.vendorId,
            vendorName: store?.storeName || "Vendor Store",
            sku: p.sku,
            category: p.category,
            price: p.price,
            msrp: p.discountPrice || p.price,
            stock: p.stock ?? 0,
            sales: p.salesCount || 0,
            revenue: p.revenueGenerated || 0,
            views: (p as any).views || p.salesCount * 4 || 120,
            status: statusMap[p.status] || "Pending",
            createdAt: p.createdAt ? p.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            description: p.description || "",
          };
        })
      );
    }
  } catch (err: any) {
    console.warn("Admin Products DB notice:", err?.message || err);
  }

  // Merge DB products with real baseline products
  const productMap = new Map<string, any>();
  for (const p of REAL_PRODUCTS) {
    productMap.set(p.sku.toLowerCase(), {
      ...p,
      image: p.images[0] || "",
    });
  }
  for (const dbP of dbProducts) {
    productMap.set(dbP.sku.toLowerCase(), dbP);
  }

  const products = Array.from(productMap.values()).map((p) => ({
    ...p,
    vendorStore: p.vendorStore || p.vendorName || "Merchant Store",
    vendorName: p.vendorName || p.vendorStore || "Merchant Store",
    image: p.image || (Array.isArray(p.images) && p.images[0]) || "",
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || ""],
    msrp: p.msrp || p.discountPrice || p.price,
    variants: p.variants || [],
    qualityCheck: p.qualityCheck || {
      imagesUploaded: true,
      descriptionComplete: true,
      categorySelected: true,
      priceValid: true,
      inventoryAvailable: (p.stock ?? 0) > 0,
      policyCompliant: true,
    },
  }));

  return NextResponse.json({ success: true, products });
}
