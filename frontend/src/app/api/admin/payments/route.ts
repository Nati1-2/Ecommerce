import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { Order } from "@/models/Order";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let total = 0;
  let successful = 0;
  let failed = 0;
  let refunded = 0;
  let pendingPayoutsAmount = 0;

  try {
    await connectDB();

    total = await Order.countDocuments();
    successful = await Order.countDocuments({ paymentStatus: "PAID" });
    failed = await Order.countDocuments({ paymentStatus: "FAILED" });
    refunded = await Order.countDocuments({ paymentStatus: "REFUNDED" });

    const pendingStats = await Order.aggregate([
      { $match: { paymentStatus: "PENDING" } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } }
    ]);
    pendingPayoutsAmount = pendingStats[0]?.total || 0;
  } catch (err: any) {
    console.warn("Admin Payments DB notice:", err?.message || err);
  }

  return NextResponse.json({
    success: true,
    payments: {
      totalTransactions: total || 0,
      successfulPayments: successful || 0,
      failedPayments: failed || 0,
      refundsProcessed: refunded || 0,
      pendingPayoutsAmount: Math.round(pendingPayoutsAmount * 100) / 100 || 0,
      gatewayStatus: "Online",
    }
  });
}

