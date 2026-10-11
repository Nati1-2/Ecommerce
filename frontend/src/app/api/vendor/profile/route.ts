import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VendorProfile } from "@/models/VendorProfile";
import { VendorProduct } from "@/models/VendorProduct";
import { Review } from "@/models/Review";
import { requireVendor } from "@/lib/authHelper";

// GET /api/vendor/profile — returns vendor profile + live computed metrics
export async function GET(req: NextRequest) {
  const auth = requireVendor(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { payload } = auth;

  try {
    await connectDB();

    // Dynamically calculate actual product count from database
    const realProductCount = await VendorProduct.countDocuments({ vendorId: payload.id });

    // Calculate real reviews for vendor's products
    const vendorProducts = await VendorProduct.find({ vendorId: payload.id }).select("_id");
    const pIds = vendorProducts.map((p) => p._id.toString());
    const reviews = pIds.length > 0 ? await Review.find({ productId: { $in: pIds } }) : [];
    const avgRating = reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 5.0;

    // Find or auto-create profile for this vendor user
    let profile = await VendorProfile.findOne({ userId: payload.id });
    if (!profile) {
      profile = await VendorProfile.create({
        userId: payload.id,
        storeName: payload.email.includes("vendor") ? "Apex Tech Wearables Store" : payload.email.split("@")[0] + "'s Store",
        slug: payload.id + "-store",
        logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80",
        banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        description: "Official vendor merchant storefront on Nati E-Commerce Platform.",
        rating: avgRating,
        totalReviews: reviews.length,
        verified: true,
        productCount: realProductCount,
        joinedDate: new Date().toISOString().split("T")[0],
        email: payload.email,
        phone: "",
        address: undefined,
      });
    } else {
      // Sync dynamic productCount and rating
      profile.productCount = realProductCount;
      if (reviews.length > 0) {
        profile.rating = avgRating;
        profile.totalReviews = reviews.length;
      }
      // If profile had the old mock phone or address, clear them
      if (profile.phone === "+1 (555) 832-9210") {
        profile.phone = "";
      }
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
