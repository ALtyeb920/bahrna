import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const role = token?.role as string | undefined;

    // ── Admin routes ─────────────────────────────────────────────────────────
    if (pathname.startsWith("/admin")) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login?reason=unauthorized", req.url));
      }
    }

    // ── Owner routes ─────────────────────────────────────────────────────────
    if (pathname.startsWith("/owner")) {
      if (role !== "OPERATOR" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login?reason=unauthorized", req.url));
      }
    }

    // ── Customer account routes ───────────────────────────────────────────────
    if (pathname.startsWith("/account") || pathname.startsWith("/my-bookings")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes — always allowed
        const publicPaths = ["/", "/yachts", "/stores", "/login", "/register", "/about", "/contact"];
        if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
          return true;
        }

        // API auth routes — always allowed
        if (pathname.startsWith("/api/auth")) return true;

        // Protected routes require token
        if (pathname.startsWith("/admin") || pathname.startsWith("/owner") || pathname.startsWith("/account") || pathname.startsWith("/my-bookings")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/owner/:path*",
    "/account/:path*",
    "/my-bookings/:path*",
  ],
};
