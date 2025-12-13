import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const url = request.nextUrl;
  const cookieToken = request.cookies.get("token")?.value || null;
  const is_public_path = path === "/login" || path === "/register";

  // User is logged in but try to access login or register page then redirect to home
  if ((path === "/login" || path === "/register") && cookieToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // User is not logged in and try to access a protected route then redirect to login
  if (!is_public_path && !cookieToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/login", "/register","/documents","/documents/:path*","/create"],
};
