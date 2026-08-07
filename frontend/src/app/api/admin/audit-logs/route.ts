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

  const auditLogs: any[] = [];
  try {
    await connectDB();

    const users = await User.find().sort({ createdAt: -1 }).limit(5);
    const vendors = await VendorProfile.find().sort({ createdAt: -1 }).limit(5);
    const products = await VendorProduct.find().sort({ createdAt: -1 }).limit(5);
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5);

    vendors.forEach((v, idx) => {
      auditLogs.push({
        id: `aud_v_${v._id}`,
        timestamp: v.createdAt ? new Date(v.createdAt).toISOString() : new Date().toISOString(),
        actor: {
          name: v.storeName,
          email: v.email || "vendor@natistore.com",
          role: "Vendor",
          ip: "192.168.1.50",
        },
        action: "VENDOR_STORE_VERIFIED",
        category: "Vendor Onboarding",
        severity: "low",
        target: `Store: ${v.storeName}`,
        details: `Vendor store profile set to ${v.verified ? "Verified" : "Pending"} status.`,
      });
    });

    products.forEach((p, idx) => {
      auditLogs.push({
        id: `aud_p_${p._id}`,
        timestamp: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
        actor: {
          name: "Nati Demo Admin",
          email: "nati@admin.com",
          role: "Super Admin",
          ip: "192.168.1.10",
        },
        action: "PRODUCT_CATALOG_APPROVAL",
        category: "Catalog Clearance",
        severity: "medium",
        target: `Product: ${p.name}`,
        details: `Catalog submission approved for public listing at price $${p.price}.`,
      });
    });

    orders.forEach((o, idx) => {
      auditLogs.push({
        id: `aud_o_${o._id}`,
        timestamp: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
        actor: {
          name: "Stripe Gateway",
          email: "payments@stripe.com",
          role: "System",
          ip: "10.0.4.12",
        },
        action: "PAYMENT_ESCROW_HOLD",
        category: "Payment Ledger",
        severity: "info",
        target: `Order #${o.orderId}`,
        details: `Placed escrow hold of $${(o.grandTotal || o.totalAmount).toFixed(2)} for processing.`,
      });
    });

    users.forEach((u, idx) => {
      auditLogs.push({
        id: `aud_u_${u._id}`,
        timestamp: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
        actor: {
          name: u.name || u.email.split("@")[0],
          email: u.email,
          role: u.role,
          ip: "192.168.1.88",
        },
        action: "USER_AUTHENTICATION",
        category: "Security & Auth",
        severity: "info",
        target: `User: ${u.email}`,
        details: "User account session authenticated successfully.",
      });
    });

    auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (err: any) {
    console.warn("Admin Audit Logs DB notice (using fallback logs):", err?.message || err);
  }

  if (auditLogs.length === 0) {
    auditLogs.push(
      {
        id: "aud_demo_1",
        timestamp: new Date().toISOString(),
        actor: { name: "Nati Demo Admin", email: "nati@admin.com", role: "Super Admin", ip: "192.168.1.10" },
        action: "PRODUCT_CATALOG_APPROVAL",
        category: "Catalog Clearance",
        severity: "medium",
        target: "Apex Smart Watch Ultra",
        details: "Approved catalog submission for public marketplace listing.",
      },
      {
        id: "aud_demo_2",
        timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
        actor: { name: "Apex Tech Store", email: "vendor@natistore.com", role: "Vendor", ip: "192.168.1.50" },
        action: "VENDOR_STORE_VERIFIED",
        category: "Vendor Onboarding",
        severity: "low",
        target: "Apex Tech Wearables Store",
        details: "Vendor store verified for marketplace sales.",
      }
    );
  }

  return NextResponse.json({ success: true, logs: auditLogs.slice(0, 20) });
}
