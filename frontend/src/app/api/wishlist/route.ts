import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { safeFindUserById, safeUpdateUser } from "@/lib/mongodb";

import { getUserFromToken } from "@/lib/authHelper";

export async function GET(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await safeFindUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      wishlist: user.wishlist || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await safeFindUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { id, name, price, originalPrice, image, category, rating, inStock } = body;

    if (!id || !name || price === undefined) {
      return NextResponse.json({ error: "Product id, name, and price are required" }, { status: 400 });
    }

    const existingWishlist = user.wishlist || [];
    if (existingWishlist.some((item: any) => item.id === id)) {
      return NextResponse.json({ success: true, wishlist: existingWishlist });
    }

    const newItem = {
      id,
      name,
      price,
      originalPrice,
      image: image || "/iphone17.png",
      category: category || "General",
      rating: rating || 4.8,
      inStock: inStock ?? true,
    };

    const updatedWishlist = [...existingWishlist, newItem];
    await safeUpdateUser(user.id, { wishlist: updatedWishlist });

    return NextResponse.json({
      success: true,
      item: newItem,
      wishlist: updatedWishlist,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add to wishlist" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    const user = await safeFindUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let updatedWishlist = [];
    if (productId === "clear-all") {
      updatedWishlist = [];
    } else {
      updatedWishlist = (user.wishlist || []).filter((item: any) => item.id !== productId);
    }

    await safeUpdateUser(user.id, { wishlist: updatedWishlist });

    return NextResponse.json({
      success: true,
      wishlist: updatedWishlist,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to remove from wishlist" }, { status: 500 });
  }
}
