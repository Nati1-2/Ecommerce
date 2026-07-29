import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { VendorProduct } from "@/models/VendorProduct";
import { requireVendor } from "@/lib/authHelper";

// GET /api/vendor/payments — transactions + payouts + balance
export async function GET(req: NextRequest) {
  const auth = requireVendor(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { payload } = auth;

  try {
    await connectDB();

    const products = await VendorProduct.find({ vendorId: payload.id }).select("_id");
    const productIds = products.map(p => p._id.toString());

    const orders = await Order.find({
      "items.productId": { $in: productIds },
      paymentStatus: "PAID",
    }).sort({ createdAt: -1 });

    // Compute revenue from each paid order
    let totalEarnings = 0;
    const transactions = orders.map(o => {
      const relevant = o.items.filter(i => productIds.includes(i.productId));
      const amount = relevant.reduce((s, i) => s + i.price * i.quantity, 0);
      const fee = Math.round(amount * 0.029 * 100) / 100; // 2.9% platform fee
      const netAmount = Math.round((amount - fee) * 100) / 100;
      totalEarnings += netAmount;

      return {
        id: `tx_${o._id}`,
        orderId: o._id.toString(),
        orderNumber: o.orderId,
        amount: Math.round(amount * 100) / 100,
        fee,
        netAmount,
        type: "Sale",
        status: "Completed",
        date: o.createdAt.toISOString().split("T")[0],
      };
    });

    // Balance: simplified (no real Stripe integration)
    const available = Math.round(totalEarnings * 0.7 * 100) / 100;
    const pending = Math.round(totalEarnings * 0.3 * 100) / 100;

    return NextResponse.json({
      success: true,
      transactions,
      payouts: [], // no payout records stored yet without Stripe
      balance: {
        available,
        pending,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
