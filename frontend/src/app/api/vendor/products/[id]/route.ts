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
    const product = await VendorProduct.findOne({ _id: id, vendorId: payload.id });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
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

    const updated = await VendorProduct.findOneAndUpdate(
      { _id: id, vendorId: payload.id },
      { $set: { ...body, updatedAt: new Date() } },
      { new: true, runValidators: false }
    );

    if (!updated) return NextResponse.json({ error: "Product not found" }, { status: 404 });
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
    const deleted = await VendorProduct.findOneAndDelete({ _id: id, vendorId: payload.id });
    if (!deleted) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
