import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface UserMetadata {
  role?: string;
}

export function middleware(req: NextRequest) {
  const { userId, sessionClaims } = getAuth(req);
  const isOnboarding = req.nextUrl.pathname === "/onboarding";
  const isPublicRoute = ["/"].includes(req.nextUrl.pathname);

  // Handle authenticated users
  if (userId) {
    const userRole = (sessionClaims?.metadata as UserMetadata)?.role;

    // If user has no role and is not on onboarding page, redirect to onboarding
    if (!userRole && !isOnboarding) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // If user has role and is on onboarding page, redirect to dashboard
    if (userRole && isOnboarding) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Handle non-authenticated users
  if (!userId && !isPublicRoute) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Temporarily disabled to test without Clerk
  matcher: [],
  // matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
