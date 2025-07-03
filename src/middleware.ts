import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/jobs') || pathname.startsWith('/profile'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua path kecuali:
     * - /api (rute API)
     * - /_next/static (file statis Next.js)
     * - /_next/image (file optimasi gambar Next.js)
     * - /favicon.ico (file favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
