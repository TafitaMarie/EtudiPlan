import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/taches", "/emploi_du_temp", "/budget"];
const authPaths = ["/login", "/signup"];
const apiProtectedPaths = ["/api/transactions"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isApiRoute = apiProtectedPaths.some((path) => pathname.startsWith(path));
  const isProtectedPage = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  if (!token) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (isProtectedPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
