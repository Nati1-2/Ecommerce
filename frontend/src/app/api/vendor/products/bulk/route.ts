import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VendorProduct } from "@/models/VendorProduct";
import { requireVendor } from "@/lib/authHelper";

// POST /api/vendor/products/bulk — bulk operations on vendor products
export async function POST(req: NextRequest) {
  const auth = requireVendor(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { payload } = auth;

  try {
    const { action, ids, stock } = await req.json();
    await connectDB();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array required" }, { status: 400 });
    }

    const baseFilter = { _id: { $in: ids }, vendorId: payload.id };

    if (action === "delete") {
      const result = await VendorProduct.deleteMany(baseFilter);
      return NextResponse.json({ success: true, action: "deleted", count: result.deletedCount });
    }

    if (action === "activate") {
      // Vendors can only unpause already-approved products (cannot bypass admin approval for Pending/Draft)
      const result = await VendorProduct.updateMany(
        { ...baseFilter, status: "Paused" },
        { $set: { status: "Active", updatedAt: new Date() } }
      );
      return NextResponse.json({ success: true, action: "activated", count: result.modifiedCount });
    }

    if (action === "pause") {
      const result = await VendorProduct.updateMany(
        { ...baseFilter, status: "Active" },
        { $set: { status: "Paused", updatedAt: new Date() } }
      );
      return NextResponse.json({ success: true, action: "paused", count: result.modifiedCount });
    }

    if (action === "restock") {
      if (typeof stock !== "number" || stock <= 0 || !Number.isInteger(stock)) {
        return NextResponse.json({ error: "Stock must be a positive integer" }, { status: 400 });
      }
      const result = await VendorProduct.updateMany(
        baseFilter,
        { $inc: { stock }, $set: { updatedAt: new Date() } }
      );
      return NextResponse.json({ success: true, action: "restocked", addedStock: stock, count: result.modifiedCount });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
