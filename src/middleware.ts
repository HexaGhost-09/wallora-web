import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await getSession();

  // If trying to access any route under /vault
  if (request.nextUrl.pathname.startsWith("/vault")) {
    // If it's the login page, allow it
    if (request.nextUrl.pathname === "/vault/access") {
      if (session) {
        return NextResponse.redirect(new URL("/vault/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Otherwise, check for session
    if (!session) {
      return NextResponse.redirect(new URL("/vault/access", request.url));
    }
  }

  return NextResponse.next();
}

// Config to match only /vault paths
export const config = {
  matcher: ["/vault/:path*"],
};
