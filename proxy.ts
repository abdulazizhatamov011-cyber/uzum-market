import { NextResponse, type NextRequest } from "next/server";

// O'zbekcha — asosiy til, manzilda prefikssiz: /cart → ichkarida /uz/cart sahifasi ko'rsatiladi.
// Ruscha — /ru/cart. /uz/... ko'rinishidagi manzil prefikssiz variantga yo'naltiriladi.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/uz" || pathname.startsWith("/uz/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (pathname === "/ru" || pathname.startsWith("/ru/")) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/uz${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // API, admin panel, Next.js ichki fayllari va nuqtali fayllar (icon.svg, manifest.webmanifest...) tegilmaydi
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
