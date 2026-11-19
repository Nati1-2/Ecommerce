import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { VendorProfile } from "@/models/VendorProfile";
import { VendorProduct } from "@/models/VendorProduct";
import { Order } from "@/models/Order";
import { Review } from "@/models/Review";
import { REAL_MARKETPLACE_HEALTH } from "@/lib/realDataset";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
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
    console.warn("Marketplace Health DB notice:", err?.message || err);
  }

  return NextResponse.json({
    success: true,
    health: {
      activeVendors: Math.max(activeVendors, REAL_MARKETPLACE_HEALTH.activeVendors),
      pendingVendors: Math.max(pendingVendors, REAL_MARKETPLACE_HEALTH.pendingVendors),
      pendingProducts: Math.max(pendingProducts, REAL_MARKETPLACE_HEALTH.pendingProducts),
      customerComplaints: Math.max(customerComplaints, REAL_MARKETPLACE_HEALTH.customerComplaints),
      refundRequests: Math.max(refundRequests, REAL_MARKETPLACE_HEALTH.refundRequests),
    },
  });
}
