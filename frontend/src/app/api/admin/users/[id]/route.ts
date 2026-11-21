import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { User } from "@/models/User";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await connectDB();
    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const updates = await req.json();

    await connectDB();
    const mongoUpdates: Record<string, any> = {};
    if (updates.status !== undefined) mongoUpdates.isVerified = updates.status !== "Blocked";
    if (updates.role) {
      const allowedRoles = ["ADMIN", "VENDOR", "CUSTOMER"];
      const upperRole = updates.role.toUpperCase();
      if (!allowedRoles.includes(upperRole)) {
        return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
      }
      mongoUpdates.role = upperRole;
      mongoUpdates.membership = upperRole === "ADMIN" ? "SuperAdmin Tier 👑" : upperRole === "VENDOR" ? "Vendor Merchant 🚀" : "Standard Member ⭐";
    }
    if (updates.name && typeof updates.name === "string") mongoUpdates.name = updates.name.trim();
    if (updates.password) {
      if (typeof updates.password === "string" && updates.password.length >= 8) {
        mongoUpdates.password = await bcrypt.hash(updates.password, 12);
      } else {
        return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, { $set: mongoUpdates }, { new: true }).select("-password");
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (id === auth.payload.id) {
      return NextResponse.json({ error: "Cannot delete your own administrator account" }, { status: 400 });
    }

    await connectDB();
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
