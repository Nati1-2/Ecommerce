import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { Order } from "@/models/Order";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const timeframe = searchParams.get("timeframe") || "monthly";

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueData = months.map((month) => ({
    date: month,
    revenue: 0,
    sales: 0,
    profit: 0,
  }));

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const userGrowthData = days.map((day) => ({
    date: day,
    newUsers: 0,
    activeUsers: 0,
    returningUsers: 0,
  }));

  try {
    await connectDB();

    const orders = await Order.find({ paymentStatus: "PAID" });
    const userOrderCounts = new Map<string, number>();

    orders.forEach((o) => {
      const date = new Date(o.createdAt);
      const mIdx = date.getMonth();
      const rev = o.grandTotal || o.totalAmount || 0;
      revenueData[mIdx].revenue += rev;
      revenueData[mIdx].sales += 1;
      revenueData[mIdx].profit += Math.round(rev * 0.15 * 100) / 100;

      if (o.userId) {
        userOrderCounts.set(o.userId, (userOrderCounts.get(o.userId) || 0) + 1);
      }
    });

    revenueData.forEach((item) => {
      item.revenue = Math.round(item.revenue * 100) / 100;
      item.profit = Math.round(item.profit * 100) / 100;
    });

    const users = await User.find();
    users.forEach((u) => {
      const date = new Date(u.createdAt);
      const dIdx = date.getDay();
      userGrowthData[dIdx].newUsers += 1;

      const orderCount = userOrderCounts.get(u._id.toString()) || 0;
      if (orderCount > 0) {
        userGrowthData[dIdx].activeUsers += 1;
      }
      if (orderCount > 1) {
        userGrowthData[dIdx].returningUsers += 1;
      }
    });
  } catch (err: any) {
    console.warn("Admin Analytics DB notice:", err?.message || err);
  }

  return NextResponse.json({
    success: true,
    analytics: {
      timeframe,
      revenueData,
      userGrowthData,
    }
  });
}

