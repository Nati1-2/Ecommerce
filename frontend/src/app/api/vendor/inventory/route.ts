import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VendorProduct } from "@/models/VendorProduct";
import { Order } from "@/models/Order";
import { requireVendor } from "@/lib/authHelper";

// GET /api/vendor/inventory — live inventory view of vendor's products
export async function GET(req: NextRequest) {
  const auth = requireVendor(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { payload } = auth;

  try {
    await connectDB();
    const products = await VendorProduct.find({ vendorId: payload.id });

    const orders = await Order.find({
      "items.productId": { $in: products.map((p) => p._id.toString()) },
      orderStatus: { $in: ["PENDING", "PROCESSING", "Pending", "Processing"] },
    });

    const inventory = products.map((p) => {
      const pidStr = p._id.toString();
      let reservedStock = 0;
      for (const order of orders) {
        for (const item of order.items || []) {
          if (item.productId === pidStr) {
            reservedStock += item.quantity || 1;
          }
        }
      }

      const availableStock = p.stock ?? 0;
      const totalStock = availableStock + reservedStock;

      return {
        id: `inv_${p._id}`,
        productId: pidStr,
        productName: p.name,
        productImage: p.images?.[0] || "",
        sku: p.sku,
        totalStock,
        availableStock,
        reservedStock,
        warehouse: p.warehouseLocation || "USA-WEST-01",
        status:
          availableStock === 0
            ? "Out of Stock"
            : availableStock <= (p.lowStockThreshold || 5)
            ? "Low Stock"
            : "In Stock",
        lastUpdated: p.updatedAt ? p.updatedAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      };
    });

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

    const pendingOrders = await Order.find({
      "items.productId": productId,
      orderStatus: { $in: ["PENDING", "PROCESSING", "Pending", "Processing"] },
    });

    let reservedStock = 0;
    for (const order of pendingOrders) {
      for (const item of order.items || []) {
        if (item.productId === productId) {
          reservedStock += item.quantity || 1;
        }
      }
    }

    const availableStock = updated.stock ?? 0;
    const totalStock = availableStock + reservedStock;

    return NextResponse.json({
      success: true,
      inventory: {
        id: `inv_${updated._id}`,
        productId: updated._id.toString(),
        productName: updated.name,
        productImage: updated.images?.[0] || "",
        sku: updated.sku,
        totalStock,
        availableStock,
        reservedStock,
        warehouse: updated.warehouseLocation || "USA-WEST-01",
        status:
          availableStock === 0
            ? "Out of Stock"
            : availableStock <= (updated.lowStockThreshold || 5)
            ? "Low Stock"
            : "In Stock",
        lastUpdated: new Date().toISOString().split("T")[0],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}
