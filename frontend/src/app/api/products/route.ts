import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { redis } from "@/lib/redis";
import { getUserFromToken } from "@/lib/authHelper";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));

    const cacheKey = `products:${category || "all"}:${search || "none"}:${page}:${limit}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json(JSON.parse(cached));
      }
    } catch {
      // Redis optional cache fallback
    }

    await connectDB();

    const query: any = { isActive: true };
    if (category) query.category = category;
    if (search) {
      const sanitizedSearch = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { name: { $regex: sanitizedSearch, $options: "i" } },
        { description: { $regex: sanitizedSearch, $options: "i" } },
        { brand: { $regex: sanitizedSearch, $options: "i" } },
      ];
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const result = {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };

    try {
      await redis.set(cacheKey, JSON.stringify(result), 300);
    } catch {
      // Redis optional cache fallback
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authorization: Only VENDOR or ADMIN can create products
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Authentication required to create products" },
        { status: 401 }
      );
    }

    if (decoded.role !== "VENDOR" && decoded.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Vendor or Administrator access required" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // 2. Strict Input Validation & Field Allowlisting (Anti-Mass Assignment)
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const price = Number(body.price);
    const category = String(body.category || "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Product name is required (minimum 2 characters)" }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({ error: "Product description is required" }, { status: 400 });
    }

    if (isNaN(price) || price < 0) {
      return NextResponse.json({ error: "A valid positive price is required" }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    // Server-assigned ownership
    const sellerId = decoded.role === "ADMIN" && body.sellerId ? String(body.sellerId) : decoded.id;

    const sanitizedProduct = {
      name,
      description,
      price,
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
      category,
      subcategory: body.subcategory ? String(body.subcategory).trim() : "",
      images: Array.isArray(body.images) ? body.images.filter((img: any) => typeof img === "string") : [],
      stock: Math.max(0, Math.floor(Number(body.stock) || 0)),
      brand: body.brand ? String(body.brand).trim() : "",
      sku: body.sku ? String(body.sku).trim() : `SKU-${Date.now().toString(36).toUpperCase()}`,
      tags: Array.isArray(body.tags) ? body.tags.map((t: any) => String(t).trim()) : [],
      sellerId,
      isActive: true,
    };

    await connectDB();
    const product = await Product.create(sanitizedProduct);

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 400 });
  }
}
