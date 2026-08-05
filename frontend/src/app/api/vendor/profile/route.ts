import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VendorProfile } from "@/models/VendorProfile";
import { VendorProduct } from "@/models/VendorProduct";
import { Order } from "@/models/Order";
import { requireVendor } from "@/lib/authHelper";

// GET /api/vendor/profile — returns vendor profile + live metrics
export async function GET(req: NextRequest) {
  const auth = requireVendor(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { payload } = auth;

  try {
    await connectDB();

    // Find or auto-create profile for this vendor user
    let profile = await VendorProfile.findOne({ userId: payload.id });
    if (!profile) {
      profile = await VendorProfile.create({
        userId: payload.id,
        storeName: payload.email.split("@")[0] + "'s Store",
        slug: payload.id + "-store",
        email: payload.email,
        joinedDate: new Date().toISOString().split("T")[0],
        verified: false,
      });
    }

    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}

// PUT /api/vendor/profile — update store profile / settings
export async function PUT(req: NextRequest) {
  const auth = requireVendor(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { payload } = auth;

  try {
    const body = await req.json();
    await connectDB();

    const updated = await VendorProfile.findOneAndUpdate(
      { userId: payload.id },
      { $set: body },
      { new: true, upsert: true, runValidators: false }
    );

    return NextResponse.json({ success: true, profile: updated });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}
