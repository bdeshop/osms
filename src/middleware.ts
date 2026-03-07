import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DUMMY_USER } from "@/lib/dummyAuth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = DUMMY_USER.role;

  // Function to check if a route is allowed for the role
  const isAllowed = (allowedRoles: string[]) => allowedRoles.includes(role);

  // 1️⃣ Admin routes (SUPER_ADMIN and ADMIN)
  if (pathname.startsWith("/admin") && !isAllowed(["SUPER_ADMIN", "ADMIN"])) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2️⃣ User routes (USER role)
  if (
    pathname.startsWith("/users") &&
    !isAllowed(["USER", "ADMIN", "SUPER_ADMIN"])
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to all protected routes
export const config = {
  matcher: ["/admin/:path*", "/users/:path*"],
};
