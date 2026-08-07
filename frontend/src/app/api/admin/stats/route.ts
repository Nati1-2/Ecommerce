import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { User } from "@/models/User";
import { VendorProfile } from "@/models/VendorProfile";
import { VendorProduct } from "@/models/VendorProduct";
import { Order } from "@/models/Order";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let userCount = 0;
  let vendorCount = 0;
  let productCount = 0;
  let orderCount = 0;
  let totalRevenue = 0;
  let isDbConnected = false;

  // For growth calculation
  let usersGrowth = 0;
  let vendorsGrowth = 0;
  let productsGrowth = 0;
  let ordersGrowth = 0;
  let revenueGrowth = 0;

  try {
    await connectDB();
    isDbConnected = true;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // ---- Total counts ----
    userCount = await User.countDocuments();
    vendorCount = await VendorProfile.countDocuments();
    productCount = await VendorProduct.countDocuments();
    orderCount = await Order.countDocuments();

    // ---- Revenue from paid orders ----
    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "PAID" } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } }
    ]);
    totalRevenue = Math.round((revenueAgg[0]?.total || 0) * 100) / 100;

    // ---- Growth: new records this month vs previous month ----
    const usersThisMonth = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const usersPrevMonth = await User.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });
    usersGrowth = usersPrevMonth > 0 ? Math.round(((usersThisMonth - usersPrevMonth) / usersPrevMonth) * 1000) / 10 : (usersThisMonth > 0 ? 100 : 0);

    const vendorsThisMonth = await VendorProfile.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const vendorsPrevMonth = await VendorProfile.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });
    vendorsGrowth = vendorsPrevMonth > 0 ? Math.round(((vendorsThisMonth - vendorsPrevMonth) / vendorsPrevMonth) * 1000) / 10 : (vendorsThisMonth > 0 ? 100 : 0);

    const productsThisMonth = await VendorProduct.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const productsPrevMonth = await VendorProduct.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });
    productsGrowth = productsPrevMonth > 0 ? Math.round(((productsThisMonth - productsPrevMonth) / productsPrevMonth) * 1000) / 10 : (productsThisMonth > 0 ? 100 : 0);

    const ordersThisMonth = await Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const ordersPrevMonth = await Order.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });
    ordersGrowth = ordersPrevMonth > 0 ? Math.round(((ordersThisMonth - ordersPrevMonth) / ordersPrevMonth) * 1000) / 10 : (ordersThisMonth > 0 ? 100 : 0);

    const revThisMonth = await Order.aggregate([
      { $match: { paymentStatus: "PAID", createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } }
    ]);
    const revPrevMonth = await Order.aggregate([
      { $match: { paymentStatus: "PAID", createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } }
    ]);
    const revThis = revThisMonth[0]?.total || 0;
    const revPrev = revPrevMonth[0]?.total || 0;
    revenueGrowth = revPrev > 0 ? Math.round(((revThis - revPrev) / revPrev) * 1000) / 10 : (revThis > 0 ? 100 : 0);

  } catch (err: any) {
    console.warn("Admin Stats DB notice (using fallback stats):", err?.message || err);
  }

  return NextResponse.json({
    success: true,
    isFallback: !isDbConnected,
    stats: {
      users: userCount,
      usersGrowth,
      vendors: vendorCount,
      vendorsGrowth,
      products: productCount,
      productsGrowth,
      orders: orderCount,
      ordersGrowth,
      revenue: totalRevenue,
      revenueGrowth,
    }
  });
}

