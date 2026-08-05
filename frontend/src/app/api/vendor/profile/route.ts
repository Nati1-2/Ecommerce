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
        storeName: payload.email.includes("vendor") ? "Apex Tech Wearables Store" : payload.email.split("@")[0] + "'s Store",
        slug: payload.id + "-store",
        logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80",
        banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        description: "Your destination for premium smartwatches, audio, and mobile accessories.",
        rating: 4.8,
        totalReviews: 2,
        verified: true,
        productCount: 3,
        joinedDate: "2026-01-15",
        email: payload.email,
        phone: "+1 (555) 832-9210",
        address: { street: "100 Innovation Way", city: "San Jose", state: "CA", zip: "95110", country: "US" },
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
