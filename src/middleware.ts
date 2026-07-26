import { NextRequest, NextResponse } from "next/server";

const DESK_HOSTS = new Set([
  "desk.souravamseekar.com",
  "desk.localhost",
  "desk.localhost:3000",
]);

function hostOf(req: NextRequest): string {
  return (req.headers.get("host") || "").toLowerCase().split(",")[0].trim();
}

function isAssetPath(pathname: string): boolean {
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/favicon")) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") return true;
  if (pathname === "/rss.xml" || pathname === "/opengraph-image") return true;
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const host = hostOf(req);
  const { pathname } = req.nextUrl;

  // desk.souravamseekar.com → desk-site
  if (DESK_HOSTS.has(host) || host.startsWith("desk.")) {
    if (
      isAssetPath(pathname) ||
      pathname.startsWith("/desk-site") ||
      pathname.startsWith("/api/desk")
    ) {
      return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    if (pathname === "/" || pathname === "") {
      url.pathname = "/desk-site";
    } else if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    } else {
      url.pathname = `/desk-site${pathname}`;
    }
    return NextResponse.rewrite(url);
  }

  // Block public access to desk-site on blog host
  if (
    pathname.startsWith("/desk-site") &&
    !DESK_HOSTS.has(host) &&
    !host.startsWith("desk.") &&
    process.env.NODE_ENV === "production"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
