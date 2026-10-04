import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader || req.cookies.get("token")?.value;

    const gatewayUrl = process.env.API_GATEWAY_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000";
    if (token) {
      try {
        await fetch(`${gatewayUrl}/api/v1/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
          },
        });
      } catch (e) {
        // Backend service unreachable, proceed with local logout
      }
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    response.cookies.set("token", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to logout" }, { status: 500 });
  }
}
