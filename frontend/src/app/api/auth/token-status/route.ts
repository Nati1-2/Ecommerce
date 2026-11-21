import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authTokens } from "@/lib/authTokens";

const tokenSchema = z.object({
  token: z.string().min(1).max(8192),
  type: z.enum(["access", "refresh"]).default("access"),
});

export async function POST(req: NextRequest) {
  const input = tokenSchema.safeParse(await req.json().catch(() => null));
  if (!input.success) return NextResponse.json({ valid: false }, { status: 400 });
  try {
    const payload = input.data.type === "refresh"
      ? await authTokens.verifyRefreshToken(input.data.token)
      : await authTokens.verifyAccessToken(input.data.token);
    return NextResponse.json({ valid: Boolean(payload) }, { status: payload ? 200 : 401 });
  } catch {
    return NextResponse.json({ valid: false }, { status: 503 });
  }
}
