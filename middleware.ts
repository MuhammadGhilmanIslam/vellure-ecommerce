import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

const { auth } = NextAuth(authConfig)
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ── Admin login page: always accessible (no redirect) ──
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // ── Admin routes (non-login) ────────────────────────────
  if (pathname.startsWith('/admin')) {
    try {
      const session = await auth()

      if (!session) {
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }

      if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch {
      // DB unavailable or auth error — allow access but layout will re-check
      return NextResponse.next()
    }
  }

  // ── Account routes ──────────────────────────────────────
  if (pathname.startsWith('/account')) {
    try {
      const session = await auth()
      if (!session) {
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }
    } catch {
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
  ],
}
