import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip middleware for API routes, static files, and auth pages
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/auth/") ||
    pathname === "/auth/signin"
  ) {
    return NextResponse.next();
  }

  // Check if user is authenticated by calling the session API
  try {
    const sessionUrl = new URL("/api/auth/session", req.url);
    const sessionResponse = await fetch(sessionUrl, {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    if (!sessionResponse.ok) {
      throw new Error("Session check failed");
    }

    const session = await sessionResponse.json();

    // If no user in session, redirect to login
    if (!session?.user) {
      console.log("No user session found, redirecting to login");
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Optional: Add user info to headers for downstream use
    const response = NextResponse.next();
    response.headers.set("x-user-id", session.user.id);
    response.headers.set("x-user-role", session.user.role);
    response.headers.set("x-user-email", session.user.email);

    return response;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  //matcher: ["/dashboard", "/dashboard/:path*"],
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth).*)"],
};
