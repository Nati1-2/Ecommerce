import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { requireVendor } from "@/lib/authHelper";

// GET /api/vendor/reviews — all reviews for vendor's products
export async function GET(req: NextRequest) {
  const auth = requireVendor(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { payload } = auth;

  try {
    await connectDB();
    const reviews = await Review.find({ vendorId: payload.id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, reviews });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}
