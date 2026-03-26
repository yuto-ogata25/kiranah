import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 保護対象ルート以外は素通り
  const isProtected =
    pathname.startsWith("/admin") || pathname.startsWith("/mypage")

  if (!isProtected) {
    return NextResponse.next()
  }

  // NextAuth v5のセッションCookie名（HTTPSではSecureプレフィックスが付く）
  const sessionToken =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token")

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/mypage/:path*", "/mypage"],
}
