import type { NextAuthConfig } from "next-auth"

/**
 * Edge-compatible auth configuration.
 * This file does NOT import Prisma or bcrypt, so it can run in Edge Runtime (middleware).
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register") ||
        nextUrl.pathname.startsWith("/forgot-password")

      if (isAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl))
        return true
      }

      return isLoggedIn
    },
    jwt({ token, user }) {
      if (user) {
        token.userId = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string
      }
      return session
    },
  },
  providers: [], // Providers are added in auth.ts (not edge-compatible)
}
