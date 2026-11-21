import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VendorProduct } from "@/models/VendorProduct";
import { requireVendor } from "@/lib/authHelper";

// GET /api/vendor/products — list vendor's own products
export async function GET(req: NextRequest) {
  const auth = await requireVendor(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { payload } = auth;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));

    await connectDB();

    const query: any = { vendorId: payload.id };
    if (status && status !== "All") query.status = status;
    if (search) {
      const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { name: { $regex: sanitizedSearch, $options: "i" } },
        { sku: { $regex: sanitizedSearch, $options: "i" } },
        { brand: { $regex: sanitizedSearch, $options: "i" } },
      ];
    }

    const total = await VendorProduct.countDocuments(query);
    const products = await VendorProduct.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({ success: true, products, total, page });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}

// POST /api/vendor/products — create a new product
export async function POST(req: NextRequest) {
  const auth = await requireVendor(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { payload } = auth;

  try {
    const body = await req.json();
    await connectDB();

    // Strict validation
    if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
      return NextResponse.json({ error: "Product name is required (min 2 characters)" }, { status: 400 });
    }
    if (typeof body.price !== "number" || body.price < 0 || isNaN(body.price)) {
      return NextResponse.json({ error: "A valid positive price is required" }, { status: 400 });
    }
    if (!body.category || typeof body.category !== "string") {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const name = body.name.trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const sku = (typeof body.sku === "string" && body.sku.trim())
      ? body.sku.trim().toUpperCase()
      : `SKU-${Date.now().toString(36).toUpperCase()}`;

    // Allowlist strictly safe fields
    const productData = {
      name,
      slug,
      sku,
      brand: typeof body.brand === "string" ? body.brand.trim() : "",
      category: body.category.trim(),
      description: typeof body.description === "string" ? body.description.trim() : "",
      price: Math.round(body.price * 100) / 100,
      discountPrice: typeof body.discountPrice === "number" && body.discountPrice >= 0 ? body.discountPrice : undefined,
      currency: "USD",
      stock: typeof body.stock === "number" && body.stock >= 0 ? Math.floor(body.stock) : 0,
      warehouseLocation: typeof body.warehouseLocation === "string" ? body.warehouseLocation.trim() : "",
      lowStockThreshold: typeof body.lowStockThreshold === "number" && body.lowStockThreshold >= 0 ? Math.floor(body.lowStockThreshold) : 5,
      images: Array.isArray(body.images) ? body.images.filter((img: any) => typeof img === "string") : [],
      variants: Array.isArray(body.variants) ? body.variants : [],
      weightKg: typeof body.weightKg === "number" && body.weightKg > 0 ? body.weightKg : 1,
      deliveryTimeDays: typeof body.deliveryTimeDays === "string" ? body.deliveryTimeDays.trim() : "2-4 Business Days",
      seoTitle: typeof body.seoTitle === "string" ? body.seoTitle.trim() : undefined,
      metaDescription: typeof body.metaDescription === "string" ? body.metaDescription.trim() : undefined,
      vendorId: payload.id, // Strictly derived from authenticated server credentials
      status: "Pending" as const, // Always requires admin review
      salesCount: 0,
      revenueGenerated: 0,
    };

    const product = await VendorProduct.create(productData);

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json({ error: "A product with this SKU already exists for your vendor account" }, { status: 409 });
    }
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}
