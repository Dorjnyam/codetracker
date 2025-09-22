import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Don't redirect if already on auth pages
    if (pathname.startsWith('/auth/')) {
      return NextResponse.next();
    }

    // Redirect to sign-in if no token and not on public routes
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Role-based access control
    const userRole = token.role as string;

    // Admin-only routes
    if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Teacher-only routes
    if (pathname.startsWith('/teacher') && !['TEACHER', 'ADMIN'].includes(userRole)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Student-only routes
    if (pathname.startsWith('/student') && !['STUDENT', 'TEACHER', 'ADMIN'].includes(userRole)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/auth/error',
          '/auth/verify-request',
          '/auth/forgot-password',
          '/auth/reset-password',
          '/api/auth',
          '/terms',
          '/privacy',
          '/help',
        ];

        // Check if the route is public
        const isPublicRoute = publicRoutes.some(route => 
          pathname === route || pathname.startsWith(route + '/')
        );

        // Allow access to public routes
        if (isPublicRoute) {
          return true;
        }

        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
