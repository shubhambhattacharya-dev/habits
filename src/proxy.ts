import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which routes need authentication
const protectedRoutes = [
  "/habits",
  "/challenges",
  "/focus",
  "/clarity",
  "/reflect",
];

// Define auth routes (should not be accessible if already logged in)
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's an API route or static asset
  if (
    pathname.startsWith("/api") || 
    pathname.startsWith("/_next") || 
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get("auth_token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If trying to access a protected route without a token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access login/register while already authenticated
  if (isAuthRoute && token) {
    const dashboardUrl = new URL("/habits", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // If going to the home page ("/") without a token, let them see the landing page.
  // If they have a token, maybe redirect to dashboard? (Optional, let's leave as is for now)

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
