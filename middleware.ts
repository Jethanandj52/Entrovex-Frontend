import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  const isProtectedPage = req.nextUrl.pathname.startsWith("/dashboard");

  // If user is logged in and tries to go to /login → redirect
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If user is NOT logged in and tries to access /dashboard → redirect
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
