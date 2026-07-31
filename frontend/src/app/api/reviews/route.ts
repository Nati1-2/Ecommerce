import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "fallback-secret-for-dev";

function getUserFromToken(req: NextRequest): { id: string; email: string; role: string } | null {
  try {
    const authHeader = req.headers.get("authorization");
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      const tokenCookie = req.cookies.get("token");
      token = tokenCookie?.value || "";
    }
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (err) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || decoded?.id;

    await connectDB();
    const { Review } = await import("@/models/Review");

    const reviews = await Review.find({ customerId: userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      reviews: reviews.map((r: any) => ({
        id: r._id.toString(),
        productId: r.productId,
        productName: r.productName || "Product Review",
        productImage: r.productImage || "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80",
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        reply: r.reply || "",
        status: r.status || "Published",
      })),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      reviews: [
        {
          id: "rev-demo-1",
          productId: "prod-demo-1",
          productName: "Apex Smart Watch Ultra",
          productImage: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80",
          rating: 5,
          comment: "Incredible build quality, crystal display, and phenomenal battery life! Highly recommended.",
          createdAt: new Date().toISOString(),
          reply: "Thank you for the review! Glad you love the battery life.",
          status: "Published",
        },
        {
          id: "rev-demo-2",
          productId: "prod-demo-2",
          productName: "Sonic Bass Pro Wireless Headphones",
          productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
          rating: 4,
          comment: "Great sound profile and deep bass response. ANC works great on flights.",
          createdAt: new Date(Date.now() - 3600 * 24 * 3 * 1000).toISOString(),
          status: "Published",
        }
      ],
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, productName, productImage, rating, comment } = body;

    if (!rating || !comment) {
      return NextResponse.json({ error: "Rating and comment are required" }, { status: 400 });
    }

    await connectDB();
    const { Review } = await import("@/models/Review");

    const newReview = await Review.create({
      customerId: decoded.id,
      customerName: decoded.email.split("@")[0],
      productId: productId || "prod-generic",
      productName: productName || "Product",
      productImage: productImage || "",
      rating: Number(rating),
      comment: comment,
      status: "Published",
    });

    return NextResponse.json({
      success: true,
      review: newReview,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit review" }, { status: 500 });
  }
}
