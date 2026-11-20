import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VendorProduct } from "@/models/VendorProduct";
import { requireVendor } from "@/lib/authHelper";

// GET /api/vendor/products/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireVendor(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { payload } = auth;

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    await connectDB();

    const query = payload.role === "ADMIN" ? { _id: id } : { _id: id, vendorId: payload.id };
    const product = await VendorProduct.findOne(query);

    if (!product) {
      // Check if product exists for another vendor to return appropriate status
      const exists = await VendorProduct.findById(id);
      if (exists) {
        return NextResponse.json({ error: "Forbidden: You do not own this product" }, { status: 403 });
      }
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/vendor/products/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireVendor(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { payload } = auth;

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();
    await connectDB();

    // Verify ownership
    const existing = await VendorProduct.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (existing.vendorId !== payload.id && payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: You do not have permission to modify this product" }, { status: 403 });
    }

    // Allowlist safe fields only (prevent privilege/status escalation and vendorId hijacking)
    const updates: Record<string, any> = {};

    if (typeof body.name === "string" && body.name.trim().length >= 2) {
      updates.name = body.name.trim();
      updates.slug = body.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }
    if (typeof body.description === "string") updates.description = body.description.trim();
    if (typeof body.price === "number") {
      if (body.price < 0 || isNaN(body.price)) {
        return NextResponse.json({ error: "Price must be a positive number" }, { status: 400 });
      }
      updates.price = Math.round(body.price * 100) / 100;
    }
    if (typeof body.discountPrice === "number") {
      if (body.discountPrice < 0 || isNaN(body.discountPrice)) {
        return NextResponse.json({ error: "Discount price must be a positive number" }, { status: 400 });
      }
      updates.discountPrice = Math.round(body.discountPrice * 100) / 100;
    }
    if (typeof body.category === "string" && body.category.trim()) updates.category = body.category.trim();
    if (typeof body.brand === "string") updates.brand = body.brand.trim();
    if (typeof body.stock === "number") {
      if (body.stock < 0 || isNaN(body.stock)) {
        return NextResponse.json({ error: "Stock must be a non-negative number" }, { status: 400 });
      }
      updates.stock = Math.floor(body.stock);
    }
    if (typeof body.lowStockThreshold === "number" && body.lowStockThreshold >= 0) {
      updates.lowStockThreshold = Math.floor(body.lowStockThreshold);
    }
    if (typeof body.warehouseLocation === "string") updates.warehouseLocation = body.warehouseLocation.trim();
    if (Array.isArray(body.images)) {
      updates.images = body.images.filter((img: any) => typeof img === "string");
    }
    if (Array.isArray(body.variants)) updates.variants = body.variants;
    if (typeof body.deliveryTimeDays === "string") updates.deliveryTimeDays = body.deliveryTimeDays.trim();
    if (typeof body.seoTitle === "string") updates.seoTitle = body.seoTitle.trim();
    if (typeof body.metaDescription === "string") updates.metaDescription = body.metaDescription.trim();

    // Admins may update status; vendors may only pause/draft their products (not self-approve)
    if (payload.role === "ADMIN" && typeof body.status === "string") {
      updates.status = body.status;
    } else if (body.status === "Paused" || body.status === "Draft") {
      updates.status = body.status;
    }

    updates.updatedAt = new Date();

    const updated = await VendorProduct.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// DELETE /api/vendor/products/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireVendor(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { payload } = auth;

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    await connectDB();

    const existing = await VendorProduct.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (existing.vendorId !== payload.id && payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: You do not have permission to delete this product" }, { status: 403 });
    }

    await VendorProduct.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
