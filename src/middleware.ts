import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get user role from authToken or user data in cookies/headers
  // Since we can't access localStorage in middleware, we'll check the auth token
  const authToken = request.cookies.get("authToken")?.value;

  // For now, we'll allow access if there's an auth token
  // The actual role check will happen on the client side

  // If no auth token, redirect to login
  if (
    !authToken &&
    (pathname.startsWith("/admin") || pathname.startsWith("/user"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to all protected routes
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
