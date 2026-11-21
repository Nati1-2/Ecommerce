import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { getUserFromToken } from "@/lib/authHelper";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await connectDB();

    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      product = await Product.findOne({ $or: [{ slug: id }, { sku: id }] });
    }

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const decoded = await getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ $or: [{ sku: id }, { slug: id }] });
    }

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Ownership check: Caller must be ADMIN or the owning seller
    const isOwner = product.sellerId === decoded.id;
    const isAdmin = decoded.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You are not authorized to modify another vendor's product." },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Strict allowlist for updates (Anti-Mass Assignment)
    if (body.name !== undefined) product.name = String(body.name).trim();
    if (body.description !== undefined) product.description = String(body.description).trim();
    if (body.price !== undefined && !isNaN(Number(body.price))) product.price = Number(body.price);
    if (body.compareAtPrice !== undefined) product.compareAtPrice = body.compareAtPrice ? Number(body.compareAtPrice) : null;
    if (body.category !== undefined) product.category = String(body.category).trim();
    if (body.stock !== undefined && !isNaN(Number(body.stock))) product.stock = Math.max(0, Math.floor(Number(body.stock)));
    if (body.brand !== undefined) product.brand = String(body.brand).trim();
    if (body.isActive !== undefined) product.isActive = Boolean(body.isActive);
    if (Array.isArray(body.images)) product.images = body.images.filter((img: any) => typeof img === "string");
    if (Array.isArray(body.tags)) product.tags = body.tags.map((t: any) => String(t).trim());

    await product.save();

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update product" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const decoded = await getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ $or: [{ sku: id }, { slug: id }] });
    }

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Ownership check: Caller must be ADMIN or the owning seller
    const isOwner = product.sellerId === decoded.id;
    const isAdmin = decoded.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You are not authorized to delete another vendor's product." },
        { status: 403 }
      );
    }

    await Product.findByIdAndDelete(product._id);

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to delete product" }, { status: 500 });
  }
}
