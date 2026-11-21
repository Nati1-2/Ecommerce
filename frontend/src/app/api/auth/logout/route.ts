import { NextRequest, NextResponse } from "next/server";
import { authTokens } from "@/lib/authTokens";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : req.cookies.get("token")?.value;

    const gatewayUrl = process.env.API_GATEWAY_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "");
    if (token) {
      if (gatewayUrl) {
        const backendResponse = await fetch(`${gatewayUrl}/api/v1/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
          },
        });
        if (!backendResponse.ok) {
          return NextResponse.json({ error: "Unable to revoke backend session" }, { status: 503 });
        }
      }
      await authTokens.revokeToken(token);
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
      expires: new Date(0),
    });
    response.cookies.set("session_id", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Unable to revoke session" }, { status: 503 });
  }
}
