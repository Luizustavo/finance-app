import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - icons (PWA icons)
     * - api/auth (auth endpoints)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icons|api/auth).*)",
  ],
}
