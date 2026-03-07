import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { logAdminAction } from "@/lib/db/tracking";

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();

    const success = await login(secret);

    if (success) {
      await logAdminAction("Login", `Admin logged in from ${request.headers.get("x-forwarded-for") || "unknown"}`);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
