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

    const filter = { _id: { $in: ids }, vendorId: payload.id };

    if (action === "delete") {
      await VendorProduct.deleteMany(filter);
      return NextResponse.json({ success: true, action: "deleted", count: ids.length });
    }

    if (action === "activate") {
      await VendorProduct.updateMany(filter, { $set: { status: "Active" } });
      return NextResponse.json({ success: true, action: "activated" });
    }

    if (action === "pause") {
      await VendorProduct.updateMany(filter, { $set: { status: "Paused" } });
      return NextResponse.json({ success: true, action: "paused" });
    }

    if (action === "restock" && typeof stock === "number") {
      await VendorProduct.updateMany(filter, { $inc: { stock } });
      return NextResponse.json({ success: true, action: "restocked", addedStock: stock });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
