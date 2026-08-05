import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VendorProduct } from "@/models/VendorProduct";
import { requireVendor } from "@/lib/authHelper";

// GET /api/vendor/inventory — live inventory view of vendor's products
export async function GET(req: NextRequest) {
  const auth = requireVendor(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { payload } = auth;

  try {
    await connectDB();
    const products = await VendorProduct.find({ vendorId: payload.id });

    const inventory = products.map(p => ({
      id: `inv_${p._id}`,
      productId: p._id.toString(),
      productName: p.name,
      productImage: p.images?.[0] || "",
      sku: p.sku,
      totalStock: p.stock + 5,
      availableStock: p.stock,
      reservedStock: 5,
      warehouse: p.warehouseLocation || "Default Warehouse",
      status:
        p.stock === 0
          ? "Out of Stock"
          : p.stock <= (p.lowStockThreshold || 5)
          ? "Low Stock"
          : "In Stock",
      lastUpdated: p.updatedAt ? p.updatedAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    }));

    return NextResponse.json({ success: true, inventory });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}

// PATCH /api/vendor/inventory — update stock for one product
export async function PATCH(req: NextRequest) {
  const auth = requireVendor(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { payload } = auth;

  try {
    const { productId, stock } = await req.json();
    if (!productId || typeof stock !== "number") {
      return NextResponse.json({ error: "productId and stock (number) required" }, { status: 400 });
    }

    await connectDB();

    const updated = await VendorProduct.findOneAndUpdate(
      { _id: productId, vendorId: payload.id },
      { $set: { stock, updatedAt: new Date() } },
      { new: true }
    );

    if (!updated) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      inventory: {
        id: `inv_${updated._id}`,
        productId: updated._id.toString(),
        productName: updated.name,
        productImage: updated.images?.[0] || "",
        sku: updated.sku,
        totalStock: updated.stock + 5,
        availableStock: updated.stock,
        reservedStock: 5,
        warehouse: updated.warehouseLocation,
        status:
          updated.stock === 0
            ? "Out of Stock"
            : updated.stock <= (updated.lowStockThreshold || 5)
            ? "Low Stock"
            : "In Stock",
        lastUpdated: new Date().toISOString().split("T")[0],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}
