import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { UserSession } from "@/models/UserSession";
import {
  AdminLoginDevice,
  AdminActivityItem,
  AdminLoginStats,
  AdminLoginDevicesResponse,
} from "@/types/adminLoginDevices";

function getSeedAdminDevices(): AdminLoginDevice[] {
  const now = Date.now();

  return [
    {
      id: "adm_dev_curr",
      sessionId: "sess_adm_curr_9918",
      adminEmail: "natnaelsolomon571@gmail.com",
      adminName: "Nati Solomon",
      role: "SuperAdmin Tier 👑",
      deviceModel: 'Apple MacBook Pro 16" (M3 Max)',
      deviceBrand: "Apple",
      deviceType: "Desktop",
      os: "macOS Sonoma 14.5",
      browser: "Google Chrome 125.0",
      ip: "104.28.19.45",
      location: {
        city: "San Francisco",
        region: "California",
        country: "United States",
        countryCode: "US",
        flag: "🇺🇸",
        isp: "Cloudflare Ingress / AT&T Fiber",
      },
      status: "CURRENT",
      loginTime: new Date(now - 45 * 60 * 1000).toISOString(),
      lastActive: new Date(now - 15 * 1000).toISOString(),
      is2FAVerified: true,
      isCurrentDevice: true,
      authMethod: "Password + JWT",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    },
    {
      id: "adm_dev_win",
      sessionId: "sess_adm_win_4102",
      adminEmail: "natnaelsolomon571@gmail.com",
      adminName: "Nati Solomon",
      role: "SuperAdmin Tier 👑",
      deviceModel: "Dell Precision 5820 Workstation",
      deviceBrand: "Dell",
      deviceType: "Workstation",
      os: "Windows 11 Pro Enterprise",
      browser: "Microsoft Edge 125.0",
      ip: "172.56.21.90",
      location: {
        city: "London",
        region: "Greater London",
        country: "United Kingdom",
        countryCode: "GB",
        flag: "🇬🇧",
        isp: "Virgin Media Business Fiber",
      },
      status: "ACTIVE",
      loginTime: new Date(now - 5 * 3600 * 1000).toISOString(),
      lastActive: new Date(now - 180 * 1000).toISOString(),
      is2FAVerified: true,
      isCurrentDevice: false,
      authMethod: "Hardware FIDO2",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0",
    },
    {
      id: "adm_dev_phone",
      sessionId: "sess_adm_iph_8841",
      adminEmail: "natnaelsolomon571@gmail.com",
      adminName: "Nati Solomon",
      role: "SuperAdmin Tier 👑",
      deviceModel: "Apple iPhone 15 Pro Max",
      deviceBrand: "Apple",
      deviceType: "Mobile",
      os: "iOS 17.5.1",
      browser: "Mobile Safari 17.5",
      ip: "188.166.44.12",
      location: {
        city: "Berlin",
        region: "Berlin",
        country: "Germany",
        countryCode: "DE",
        flag: "🇩🇪",
        isp: "Deutsche Telekom AG 5G",
      },
      status: "ACTIVE",
      loginTime: new Date(now - 14 * 3600 * 1000).toISOString(),
      lastActive: new Date(now - 25 * 60 * 1000).toISOString(),
      is2FAVerified: true,
      isCurrentDevice: false,
      authMethod: "Authenticator App",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    },
    {
      id: "adm_dev_linux",
      sessionId: "sess_adm_lnx_1092",
      adminEmail: "audit@natistore.com",
      adminName: "Security Auditor Bot",
      role: "Security Auditor",
      deviceModel: "Lenovo ThinkPad P1 Gen 6",
      deviceBrand: "Lenovo",
      deviceType: "Desktop",
      os: "Ubuntu 24.04 LTS (Security Hardened)",
      browser: "Firefox 126.0 ESR",
      ip: "192.0.2.146",
      location: {
        city: "Toronto",
        region: "Ontario",
        country: "Canada",
        countryCode: "CA",
        flag: "🇨🇦",
        isp: "Cloudflare Zero Trust Gateway",
      },
      status: "IDLE",
      loginTime: new Date(now - 48 * 3600 * 1000).toISOString(),
      lastActive: new Date(now - 6 * 3600 * 1000).toISOString(),
      is2FAVerified: true,
      isCurrentDevice: false,
      authMethod: "Hardware FIDO2",
      userAgent:
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0",
    },
  ];
}

function getSeedAdminActivities(): AdminActivityItem[] {
  const now = Date.now();

  return [
    {
      id: "act_adm_1",
      action: "PLATFORM_SETTINGS_UPDATE",
      title: "Updated Global Marketplace Settings",
      category: "system",
      details: "Changed support email to natnaelsolomon571@gmail.com and verified Telegram @natimanboss",
      targetResource: "Platform Settings: General",
      adminActor: {
        name: "Nati Solomon",
        email: "natnaelsolomon571@gmail.com",
        role: "SuperAdmin Tier 👑",
      },
      deviceUsed: 'Apple MacBook Pro 16" (M3 Max)',
      ip: "104.28.19.45",
      flag: "🇺🇸",
      timestamp: new Date(now - 2 * 60 * 1000).toISOString(),
      severity: "medium",
      status: "SUCCESS",
    },
    {
      id: "act_adm_2",
      action: "VENDOR_STORE_VERIFIED",
      title: "Approved Seller Vendor License & KYC",
      category: "vendor",
      details: "Verified corporate tax certificates and enabled instant store payouts for TechWorld Hub",
      targetResource: "Vendor ID: VND-99014 (TechWorld Hub)",
      adminActor: {
        name: "Nati Solomon",
        email: "natnaelsolomon571@gmail.com",
        role: "SuperAdmin Tier 👑",
      },
      deviceUsed: 'Apple MacBook Pro 16" (M3 Max)',
      ip: "104.28.19.45",
      flag: "🇺🇸",
      timestamp: new Date(now - 25 * 60 * 1000).toISOString(),
      severity: "high",
      status: "SUCCESS",
    },
    {
      id: "act_adm_3",
      action: "PRODUCT_CATALOG_APPROVAL",
      title: "Approved Vendor Product Catalog Submission",
      category: "catalog",
      details: "Product 'Quantum ANC Headphones' passed safety and authenticity compliance checks",
      targetResource: "Catalog SKU: PROD-QANC-BLK",
      adminActor: {
        name: "Nati Solomon",
        email: "natnaelsolomon571@gmail.com",
        role: "SuperAdmin Tier 👑",
      },
      deviceUsed: "Dell Precision 5820 Workstation",
      ip: "172.56.21.90",
      flag: "🇬🇧",
      timestamp: new Date(now - 3 * 3600 * 1000).toISOString(),
      severity: "low",
      status: "SUCCESS",
    },
    {
      id: "act_adm_4",
      action: "SECURITY_2FA_ENFORCEMENT",
      title: "Enforced Mandatory 2FA for Vendor Accounts",
      category: "security",
      details: "Updated authentication policy: All sellers with GMV > $5,000 must enable TOTP authenticator",
      targetResource: "Auth Service Policy #SEC-2FA-VENDOR",
      adminActor: {
        name: "Security Auditor Bot",
        email: "audit@natistore.com",
        role: "Security Auditor",
      },
      deviceUsed: "Lenovo ThinkPad P1 Gen 6",
      ip: "192.0.2.146",
      flag: "🇨🇦",
      timestamp: new Date(now - 8 * 3600 * 1000).toISOString(),
      severity: "critical",
      status: "SUCCESS",
    },
    {
      id: "act_adm_5",
      action: "ADMIN_LOGIN_SUCCESS",
      title: "Admin Authenticated via Password + JWT",
      category: "auth",
      details: "Dual-token access & refresh rotation issued with 15-minute validity window",
      targetResource: "API Gateway Auth Ingress",
      adminActor: {
        name: "Nati Solomon",
        email: "natnaelsolomon571@gmail.com",
        role: "SuperAdmin Tier 👑",
      },
      deviceUsed: "Apple iPhone 15 Pro Max",
      ip: "188.166.44.12",
      flag: "🇩🇪",
      timestamp: new Date(now - 14 * 3600 * 1000).toISOString(),
      severity: "medium",
      status: "SUCCESS",
    },
    {
      id: "act_adm_6",
      action: "PAYOUT_BATCH_DISPATCH",
      title: "Executed Weekly Stripe Connect Vendor Payouts",
      category: "finance",
      details: "Processed $48,250.00 across 18 verified vendor accounts with automated 15% commission retention",
      targetResource: "Stripe Connect Batch #PAY-9921",
      adminActor: {
        name: "Nati Solomon",
        email: "natnaelsolomon571@gmail.com",
        role: "SuperAdmin Tier 👑",
      },
      deviceUsed: "Dell Precision 5820 Workstation",
      ip: "172.56.21.90",
      flag: "🇬🇧",
      timestamp: new Date(now - 22 * 3600 * 1000).toISOString(),
      severity: "high",
      status: "SUCCESS",
    },
  ];
}

// In-memory state storage for live session revocation and simulated actions
let adminDevicesState: AdminLoginDevice[] = [];
let adminActivitiesState: AdminActivityItem[] = [];

function getAdminState() {
  if (adminDevicesState.length === 0) {
    adminDevicesState = getSeedAdminDevices();
  }
  if (adminActivitiesState.length === 0) {
    adminActivitiesState = getSeedAdminActivities();
  }
  return { devices: adminDevicesState, activities: adminActivitiesState };
}

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { devices, activities } = getAdminState();

  const activeCount = devices.filter((d) => d.status === "CURRENT" || d.status === "ACTIVE").length;
  const stats: AdminLoginStats = {
    activeAdminSessions: activeCount,
    totalDevicesCount: devices.length,
    trustedDevicesCount: devices.filter((d) => d.is2FAVerified).length,
    failedLoginsToday: 0,
    totalAdminActions24h: activities.length + 138,
    mfaEnforcementRate: 100,
  };

  const response: AdminLoginDevicesResponse = {
    success: true,
    stats,
    devices,
    activities,
  };

  return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { action, deviceId } = body;
    const { devices, activities } = getAdminState();

    if (action === "revoke") {
      const target = devices.find((d) => d.id === deviceId);
      if (!target) {
        return NextResponse.json({ success: false, error: "Device not found." }, { status: 404 });
      }

      target.status = "REVOKED";

      // Log the revocation as a security activity
      activities.unshift({
        id: `act_rev_${Date.now()}`,
        action: "ADMIN_SESSION_REVOKED",
        title: `Revoked Admin Session: ${target.deviceModel}`,
        category: "security",
        details: `Session ${target.sessionId} for ${target.adminEmail} terminated by Administrator`,
        targetResource: `Device: ${target.deviceModel} (${target.ip})`,
        adminActor: {
          name: "Nati Solomon",
          email: "natnaelsolomon571@gmail.com",
          role: "SuperAdmin Tier 👑",
        },
        deviceUsed: 'Apple MacBook Pro 16" (M3 Max)',
        ip: "104.28.19.45",
        flag: "🇺🇸",
        timestamp: new Date().toISOString(),
        severity: "high",
        status: "WARNING",
      });

      return NextResponse.json({
        success: true,
        message: `Session for ${target.deviceModel} has been revoked successfully.`,
        device: target,
      });
    }

    if (action === "revoke_all_others") {
      devices.forEach((d) => {
        if (!d.isCurrentDevice) {
          d.status = "REVOKED";
        }
      });

      activities.unshift({
        id: `act_revall_${Date.now()}`,
        action: "ALL_OTHER_SESSIONS_REVOKED",
        title: "Revoked All Other Active Admin Sessions",
        category: "security",
        details: "Terminated all secondary admin sessions across all remote devices",
        targetResource: "Global Admin Session Manager",
        adminActor: {
          name: "Nati Solomon",
          email: "natnaelsolomon571@gmail.com",
          role: "SuperAdmin Tier 👑",
        },
        deviceUsed: 'Apple MacBook Pro 16" (M3 Max)',
        ip: "104.28.19.45",
        flag: "🇺🇸",
        timestamp: new Date().toISOString(),
        severity: "critical",
        status: "WARNING",
      });

      return NextResponse.json({
        success: true,
        message: "All secondary admin devices have been signed out and revoked.",
      });
    }

    if (action === "simulate_action") {
      const simActions = [
        {
          action: "AUDIT_SECURITY_SWEEP",
          title: "Executed Automated Security Scan",
          category: "security" as const,
          details: "Verified TLS 1.3 certificates, Stripe webhook signatures, and Redis Redlock cluster health",
          severity: "low" as const,
        },
        {
          action: "VENDOR_FEE_ADJUSTMENT",
          title: "Updated Category Commission Tiers",
          category: "finance" as const,
          details: "Applied 8% promotional commission rate to Consumer Electronics category for Q3",
          severity: "medium" as const,
        },
        {
          action: "CACHE_PURGE",
          title: "Purged Redis Catalog Cache",
          category: "system" as const,
          details: "Flushed product matrix caches and rebuilt Meilisearch index in 48ms",
          severity: "low" as const,
        },
      ];

      const pick = simActions[Math.floor(Math.random() * simActions.length)];
      const newAct: AdminActivityItem = {
        id: `act_sim_${Date.now()}`,
        action: pick.action,
        title: pick.title,
        category: pick.category,
        details: pick.details,
        targetResource: "Platform Enterprise Core",
        adminActor: {
          name: "Nati Solomon",
          email: "natnaelsolomon571@gmail.com",
          role: "SuperAdmin Tier 👑",
        },
        deviceUsed: 'Apple MacBook Pro 16" (M3 Max)',
        ip: "104.28.19.45",
        flag: "🇺🇸",
        timestamp: new Date().toISOString(),
        severity: pick.severity,
        status: "SUCCESS",
      };

      activities.unshift(newAct);

      return NextResponse.json({
        success: true,
        message: "Admin action simulated and logged to security stream.",
        activity: newAct,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process admin session request." },
      { status: 500 }
    );
  }
}
