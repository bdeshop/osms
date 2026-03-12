import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("authToken")?.value;

  // Protect /admin and /user routes - redirect to login if no token
  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/user")) &&
    !authToken
  ) {
    return NextResponse.redirect(new URL("/adminLogin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
