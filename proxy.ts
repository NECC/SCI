import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = ["/", "/schedule", "/faqs"];
const authRoutes = ["/auth"];
const adminRoutes = ["/admin"];
const protectedRoutes = ["/profile"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  // 1. Admin Logic
  if (adminRoutes.some((path) => pathname.startsWith(path))) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (protectedRoutes.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  if (authRoutes.some((path) => pathname.startsWith(path))) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/auth/:path*",
  ],
};