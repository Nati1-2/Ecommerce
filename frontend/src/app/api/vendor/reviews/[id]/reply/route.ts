import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { requireVendor } from "@/lib/authHelper";

// PUT /api/vendor/reviews/[id]/reply — post a vendor reply to a review
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireVendor(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { payload } = auth;

  try {
    const { text } = await req.json();
    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Reply text is required" }, { status: 400 });
    }

    await connectDB();

    const review = await Review.findOneAndUpdate(
      { _id: params.id, vendorId: payload.id },
      {
        $set: {
          reply: {
            text: text.trim(),
            repliedAt: new Date().toISOString(),
          },
        },
      },
      { new: true }
    );

    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    return NextResponse.json({ success: true, review });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
