import { NextRequest, NextResponse } from 'next/server';

interface JwtPayload {
  exp?: number;
  role?: string;
  type?: string;
  user_type?: string;
  [key: string]: unknown;
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const cookieRole = req.cookies.get('role')?.value;
  const { pathname } = req.nextUrl;

  // Unauthenticated user attempting to access dashboard
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Parse JWT and check expiration
  const jwtPayload = parseJwt(token);
  if (jwtPayload && jwtPayload.exp && Math.floor(Date.now() / 1000) >= jwtPayload.exp) {
    const loginUrl = new URL('/login', req.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('token');
    response.cookies.delete('role');
    return response;
  }

  // Authoritative role determination:
  // Signed JWT claim takes strict precedence over unverified client cookie
  const tokenRole =
    typeof jwtPayload?.role === 'string'
      ? jwtPayload.role
      : typeof jwtPayload?.type === 'string'
        ? jwtPayload.type
        : typeof jwtPayload?.user_type === 'string'
          ? jwtPayload.user_type
          : null;

  const role = (tokenRole || cookieRole || '').toLowerCase();
  const isAdmin = role === 'admin';

  // Canonical redirect for root /dashboard
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return NextResponse.redirect(
      new URL(isAdmin ? '/dashboard/admin' : '/dashboard/user', req.url),
    );
  }

  // Prevent non-admin users from accessing admin dashboard routes
  if (pathname.startsWith('/dashboard/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/dashboard/user', req.url));
  }

  // Prevent admin users from accessing standard user dashboard routes
  if (pathname.startsWith('/dashboard/user') && isAdmin) {
    return NextResponse.redirect(new URL('/dashboard/admin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

