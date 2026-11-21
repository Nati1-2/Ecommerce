import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { VendorProduct } from "@/models/VendorProduct";
import { VendorProfile } from "@/models/VendorProfile";
import { z } from "zod";
import mongoose from "mongoose";

const updateSchema = z.object({
  id: z.string().refine(mongoose.isValidObjectId),
  status: z.enum(["Rejected", "Pending"]),
  message: z.string().max(1000).optional(),
});

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid product update" }, { status: 400 });
  try {
    await connectDB();
    const product = await VendorProduct.findByIdAndUpdate(parsed.data.id, {
      status: parsed.data.status,
      approvalMessage: parsed.data.message || "",
    }, { new: true, runValidators: true });
    return product
      ? NextResponse.json({ success: true, product })
      : NextResponse.json({ error: "Product not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Unable to update product" }, { status: 503 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const id = new URL(req.url).searchParams.get("id");
  if (!id || !mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }
  try {
    await connectDB();
    const product = await VendorProduct.findByIdAndDelete(id);
    return product
      ? NextResponse.json({ success: true })
      : NextResponse.json({ error: "Product not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Unable to delete product" }, { status: 503 });
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
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
              "",
            vendorId: p.vendorId,
            vendorName: store?.storeName || "Vendor Store",
            sku: p.sku,
            category: p.category,
            price: p.price,
            msrp: p.discountPrice || p.price,
            stock: p.stock ?? 0,
            sales: p.salesCount || 0,
            revenue: p.revenueGenerated || 0,
            views: (p as any).views ?? 0,
            status: statusMap[p.status] || "Pending",
            createdAt: p.createdAt ? p.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            description: p.description || "",
          };
        })
      );
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Unable to load products" }, { status: 503 });
  }

  const products = dbProducts.map((p) => ({
    ...p,
    vendorStore: p.vendorStore || p.vendorName || "Merchant Store",
    vendorName: p.vendorName || p.vendorStore || "Merchant Store",
    image: p.image || (Array.isArray(p.images) && p.images[0]) || "",
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || ""],
    msrp: p.msrp || p.discountPrice || p.price,
    variants: p.variants || [],
    qualityCheck: p.qualityCheck || {
      imagesUploaded: Boolean(p.image),
      descriptionComplete: Boolean(p.description),
      categorySelected: Boolean(p.category),
      priceValid: p.price >= 0,
      inventoryAvailable: (p.stock ?? 0) > 0,
      policyCompliant: false,
    },
  }));

  return NextResponse.json({ success: true, products });
}
