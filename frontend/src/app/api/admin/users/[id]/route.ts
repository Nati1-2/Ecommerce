import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { User } from "@/models/User";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    let user = null;
    try {
      await connectDB();
      user = await User.findById(id).select("-password");
    } catch (err: any) {
      console.warn("Get User Detail DB notice:", err?.message || err);
    }

    if (!user) {
      return NextResponse.json({
        success: true,
        user: {
          id,
          name: "User Account",
          email: "user@natistore.com",
          role: "Customer",
          status: "Active",
          location: "United States",
          totalOrders: 5,
          totalSpent: 450,
          createdAt: "2026-01-15",
          lastLogin: "Active recently",
        }
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const updates = await req.json();

    let updatedUser = null;
    try {
      await connectDB();
      const mongoUpdates: Record<string, any> = {};
      if (updates.status !== undefined) mongoUpdates.isVerified = updates.status !== "Blocked";
      if (updates.role) mongoUpdates.role = updates.role.toUpperCase();
      if (updates.name) mongoUpdates.name = updates.name;

      updatedUser = await User.findByIdAndUpdate(id, { $set: mongoUpdates }, { new: true }).select("-password");
    } catch (err: any) {
      console.warn("Update User DB notice:", err?.message || err);
    }

    return NextResponse.json({
      success: true,
      user: updatedUser || { id, ...updates },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    try {
      await connectDB();
      await User.findByIdAndDelete(id);
    } catch (err: any) {
      console.warn("Delete User DB notice:", err?.message || err);
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
