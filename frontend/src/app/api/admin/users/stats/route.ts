import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let totalUsers = 0;
  let activeUsers = 0;
  let blockedUsers = 0;
  let newUsersToday = 0;
  let usersGrowth = 0;
  let activeGrowth = 0;
  let blockedChange = 0;
  let todayGrowth = 0;

  try {
    await connectDB();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    totalUsers = await User.countDocuments();
    activeUsers = await User.countDocuments({ isVerified: true });
    blockedUsers = await User.countDocuments({ isVerified: false });
    newUsersToday = await User.countDocuments({ createdAt: { $gte: startOfToday } });

    // Growth rates
    const usersThisMonth = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const usersPrevMonth = await User.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });
    usersGrowth = usersPrevMonth > 0 ? Math.round(((usersThisMonth - usersPrevMonth) / usersPrevMonth) * 1000) / 10 : (usersThisMonth > 0 ? 100 : 0);

    const activeThisMonth = await User.countDocuments({ isVerified: true, createdAt: { $gte: thirtyDaysAgo } });
    const activePrevMonth = await User.countDocuments({ isVerified: true, createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });
    activeGrowth = activePrevMonth > 0 ? Math.round(((activeThisMonth - activePrevMonth) / activePrevMonth) * 1000) / 10 : (activeThisMonth > 0 ? 100 : 0);

  } catch (err: any) {
    console.warn("User Stats DB notice:", err?.message || err);
  }

  return NextResponse.json({
    success: true,
    stats: {
      totalUsers,
      usersGrowth,
      activeUsers,
      activeGrowth,
      blockedUsers,
      blockedChange,
      newUsersToday,
      todayGrowth,
    }
  });
}

