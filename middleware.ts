import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * The /auth/signin callback is '/'
 * @publicRoutes Anyone can access
 * @authRoutes Mustn't be signed in
 * @adminRoutes Must have ADMIN role in jwt token
 * @protectedRoutes Must be signed in
 */
const publicRoutes = ["/", "/schedule", "/faqs"];
const authRoutes = ["/auth"];
const adminRoutes = ["/admin"];
const protectedRoutes = ["/profile"];
// const apiAdminRoutes = [
//   "/api/ranking",
//   "/api/users",
//   "/api/users/accreditation",
//   "/api/enrollments/delete",
//   "/api/enrollments/attend/qrcode",
//   "/api/activities/delete",
// ];

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
  });

  // Admin paths
  // if signed in and doesn't have role SUPER_USER, can't access /super_user/**
  if (adminRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!token || token.role != "ADMIN")
      return NextResponse.redirect(new URL("/", request.url));
  }

  // Protected paths
  if (protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!token) return NextResponse.redirect(new URL("/", request.url));
  }

  // Auth paths
  // if signed in, user can't access /auth paths
  if (authRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (token) return NextResponse.redirect(new URL("/", request.url));
  }
}
