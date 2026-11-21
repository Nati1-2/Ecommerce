import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { Review } from "@/models/Review";
import { VendorProduct } from "@/models/VendorProduct";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let reviews: any[] = [];
  try {
    await connectDB();
    const dbReviews = await Review.find().sort({ createdAt: -1 });

    reviews = await Promise.all(
      dbReviews.map(async (r) => {
        const storeName = "";
        if (r.productId) {
          const product = await VendorProduct.findById(r.productId).select("name");
          if (product?.name) r.productName = product.name;
        }

        return {
          id: r._id.toString(),
          productId: r.productId,
          productName: r.productName || "",
          productImage: r.productImage || "",
          customerName: r.customerName || "",
          customerEmail: "",
          vendorName: storeName,
          rating: r.rating ?? 0,
          comment: r.comment,
          status: r.status || "Published",
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : "",
          reply: r.reply || "",
        };
      })
    );
  } catch (err: any) {
    return NextResponse.json({ error: "Unable to load reviews" }, { status: 503 });
  }

  return NextResponse.json({ success: true, reviews });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id, status, reply } = await req.json();
    await connectDB();
    const updates: Record<string, any> = {};
    if (status) updates.status = status;
    if (reply !== undefined) updates.reply = reply;
    const updated = await Review.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!updated) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      review: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    await connectDB();
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
