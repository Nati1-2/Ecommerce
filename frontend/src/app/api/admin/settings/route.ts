import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authHelper";

let systemSettings = {
  general: {
    siteName: "Apex Multi-Vendor Marketplace Engine",
    supportEmail: "support@natistore.com",
    currency: "USD",
    commissionRate: 15,
    autoApproveProducts: false,
    autoApproveVendors: false,
  },
  security: {
    requireTwoFactor: true,
    sessionTimeoutMinutes: 60,
    ipWhitelisting: false,
    maxLoginAttempts: 5,
  },
  payment: {
    stripeEnabled: true,
    paypalEnabled: true,
    payoutSchedule: "Weekly",
    minimumPayoutThreshold: 100,
  },
  maintenance: {
    maintenanceMode: false,
    debugLogs: true,
  },
};

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  return NextResponse.json({ success: true, settings: systemSettings });
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const updates = await req.json();
    systemSettings = { ...systemSettings, ...updates };
    return NextResponse.json({ success: true, settings: systemSettings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
