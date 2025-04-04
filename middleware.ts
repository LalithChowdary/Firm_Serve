import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Ensure NEXTAUTH_SECRET is set in your environment variables.
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // If no token, go to sign-in
  if (!token && pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/api/auth/signin";
    return NextResponse.redirect(url);
  }

  // If token and at root, send to specific dashboard
  if (token && pathname === "/") {
    const url = req.nextUrl.clone();
    if (token.role === "STAFF") {
      url.pathname = "/staff/dashboard";
      return NextResponse.redirect(url);
    } else if (token.role === "ADMIN") {
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    } else if (token.role === "CLIENT") {
      url.pathname = "/client/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Send staff to /staff/dashboard if outside /staff
  if (token?.role === "STAFF" && !pathname.startsWith("/staff")) {
    const url = req.nextUrl.clone();
    url.pathname = "/staff/dashboard";
    return NextResponse.redirect(url);
  }

  // Send client to /client/dashboard if outside /client
  if (token?.role === "CLIENT" && !pathname.startsWith("/client")) {
    const url = req.nextUrl.clone();
    url.pathname = "/client/dashboard";
    return NextResponse.redirect(url);
  }

  // Send admin to /admin/dashboard if outside /admin
  if (token?.role === "ADMIN" && !pathname.startsWith("/admin")) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/","/staff/:path*", "/admin/:path*", "/client/:path*"],
};
