import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './lib/jwt';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /api/v1 routes except auth routes
  if (pathname.startsWith('/api/v1') && !pathname.startsWith('/api/v1/auth')) {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: { message: "Missing or invalid token", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: { message: "Invalid or expired token", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    // Role-based Access Control (RBAC) guard
    // e.g., requireRole('admin') at Edge
    if (pathname.startsWith('/api/v1/admin') && payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: { message: "Forbidden: Admin access required", code: "FORBIDDEN" } },
        { status: 403 }
      );
    }

    // Attach user information to request headers for downstream API route handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-role', payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/v1/:path*'],
};
