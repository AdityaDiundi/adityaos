import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // On pixel engine domain, rewrite root / directly to /pixel
  // so that SSR renders Pixel Studio immediately with ZERO portfolio flash
  if (
    (hostname.includes("pixel-engine") || hostname.includes("pixel-studio")) &&
    pathname === "/"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/pixel";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
