import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  const role = req.cookies.get('role')?.value;

  const { pathname } = req.nextUrl;


  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  
  if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard/user', req.url));
  }

  
  if (pathname.startsWith('/dashboard/user') && role === 'admin') {
    return NextResponse.redirect(new URL('/dashboard/admin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
