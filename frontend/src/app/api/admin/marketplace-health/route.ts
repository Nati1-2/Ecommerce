import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { VendorProfile } from "@/models/VendorProfile";
import { VendorProduct } from "@/models/VendorProduct";
import { Order } from "@/models/Order";
import { Review } from "@/models/Review";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let activeVendors = 0;
  let pendingVendors = 0;
  let pendingProducts = 0;
  let customerComplaints = 0;
  let refundRequests = 0;

  try {
    await connectDB();

    activeVendors = await VendorProfile.countDocuments({ verified: true });
    pendingVendors = await VendorProfile.countDocuments({ verified: false });
    pendingProducts = await VendorProduct.countDocuments({ status: "Pending" });
    customerComplaints = await Review.countDocuments({ rating: { $lte: 2 } });
    refundRequests = await Order.countDocuments({ paymentStatus: "REFUNDED" });
  } catch (err: any) {
    return NextResponse.json({ error: "Unable to load marketplace health" }, { status: 503 });
  }

  return NextResponse.json({
    success: true,
    health: {
      activeVendors,
      pendingVendors,
      pendingProducts,
      customerComplaints,
      refundRequests,
    },
  });
}
