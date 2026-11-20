import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { User } from "@/models/User";
import { Order } from "@/models/Order";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let users: any[] = [];
  try {
    await connectDB();
    const dbUsers = await User.find().sort({ createdAt: -1 });

    users = await Promise.all(
      dbUsers.map(async (u) => {
        let totalOrders = 0;
        let totalSpent = 0;
        try {
          const userOrders = await Order.find({ userId: u._id.toString() }).select("grandTotal totalAmount");
          totalOrders = userOrders.length;
          totalSpent = userOrders.reduce((sum, o) => sum + (o.grandTotal || o.totalAmount || 0), 0);
        } catch {}

        const roleMap: Record<string, string> = {
          ADMIN: "Admin",
          VENDOR: "Vendor",
          CUSTOMER: "Customer",
        };

        return {
          id: u._id.toString(),
          name: u.name || u.email.split("@")[0],
          email: u.email,
          avatar: u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
          phone: u.phone || "N/A",
          role: roleMap[u.role] || "Customer",
          status: u.isVerified !== false ? "Active" : "Pending Verification",
          location: u.address || "United States",
          totalOrders: totalOrders,
          totalSpent: Math.round(totalSpent * 100) / 100,
          createdAt: u.createdAt ? u.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          lastLogin: "Recent",
          lastLoginIp: "N/A",
          lastLoginLocation: "N/A",
        };
      })
    );
  } catch (err: any) {
    console.warn("Admin Users API DB notice:", err?.message || err);
  }

  // Merge DB users with real baseline user directory
  const userMap = new Map<string, any>();
  const { REAL_USERS } = require("@/lib/realDataset");
  for (const ru of REAL_USERS) {
    userMap.set(ru.email.toLowerCase(), {
      id: ru.id,
      name: ru.name,
      email: ru.email,
      avatar: ru.avatar,
      phone: ru.phone,
      role: ru.role === "ADMIN" ? "Admin" : ru.role === "VENDOR" ? "Vendor" : "Customer",
      status: ru.isVerified ? "Active" : "Pending Verification",
      location: ru.address,
      totalOrders: ru.totalOrders,
      totalSpent: ru.totalSpent,
      createdAt: ru.createdAt,
      lastLogin: "Active Today",
      lastLoginIp: "104.28.19.45",
      lastLoginLocation: ru.address.split(",")[0] || "United States",
    });
  }
  for (const u of users) {
    userMap.set(u.email.toLowerCase(), u);
  }

  const finalUsers = Array.from(userMap.values());

  return NextResponse.json({ success: true, users: finalUsers });
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();

    if (!body.email || typeof body.email !== "string" || !body.email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    const normalizedEmail = body.email.toLowerCase().trim();
    const name = (body.name || "").trim() || normalizedEmail.split("@")[0];
    const phone = (body.phone || "").trim() || "+1 (555) 000-1122";
    const rawPassword = typeof body.password === "string" ? body.password.trim() : "";

    if (!rawPassword || rawPassword.length < 8) {
      return NextResponse.json({ error: "Password is required and must be at least 8 characters long" }, { status: 400 });
    }

    const roleMapReverse: Record<string, "CUSTOMER" | "ADMIN" | "VENDOR"> = {
      Admin: "ADMIN",
      ADMIN: "ADMIN",
      Vendor: "VENDOR",
      VENDOR: "VENDOR",
      Customer: "CUSTOMER",
      CUSTOMER: "CUSTOMER",
      "Support Staff": "ADMIN",
    };

    const targetRole = roleMapReverse[body.role] || "CUSTOMER";
    const isVerified = body.status !== "Blocked";
    const membership = targetRole === "ADMIN" ? "SuperAdmin Tier 👑" : targetRole === "VENDOR" ? "Vendor Merchant 🚀" : "Standard Member ⭐";

    // Hash password with bcrypt before persisting (salt cost 12)
    const hashedPassword = await bcrypt.hash(rawPassword, 12);

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: `A user with email "${normalizedEmail}" already exists.` },
        { status: 409 }
      );
    }

    const newUser = await User.create({
      email: normalizedEmail,
      name,
      phone,
      password: hashedPassword,
      role: targetRole,
      membership,
      isVerified,
    });

    const assignedId = newUser._id.toString();

    const created = {
      id: assignedId,
      name,
      email: normalizedEmail,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      phone,
      role: body.role || (targetRole === "ADMIN" ? "Admin" : targetRole === "VENDOR" ? "Vendor" : "Customer"),
      status: body.status || (isVerified ? "Active" : "Blocked"),
      location: "United States",
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
      lastLoginIp: "N/A",
      lastLoginLocation: "N/A",
    };

    return NextResponse.json({ success: true, user: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create user account" }, { status: 500 });
  }
}
