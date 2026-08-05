import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VendorProduct } from "@/models/VendorProduct";
import { requireVendor } from "@/lib/authHelper";

// GET /api/vendor/products — list vendor's own products
export async function GET(req: NextRequest) {
  const auth = requireVendor(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { payload } = auth;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    await connectDB();

    const query: any = { vendorId: payload.id };
    if (status && status !== "All") query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
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
  const auth = requireVendor(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { payload } = auth;

  try {
    const body = await req.json();
    await connectDB();

    if (!body.name || !body.price || !body.category) {
      return NextResponse.json({ error: "Name, price and category are required" }, { status: 400 });
    }

    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const sku = body.sku || `SKU-${Date.now().toString(36).toUpperCase()}`;

    const product = await VendorProduct.create({
      ...body,
      slug,
      sku,
      vendorId: payload.id,
      status: "Pending", // requires admin approval
      salesCount: 0,
      revenueGenerated: 0,
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}
