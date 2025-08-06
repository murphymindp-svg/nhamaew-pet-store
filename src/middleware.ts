import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Protected routes that require authentication
                const protectedRoutes = ['/favourite', '/history', '/my-cart'];

                // Check if the current path is a protected route
                const isProtectedRoute = protectedRoutes.some(route =>
                    pathname.startsWith(route)
                );

                // If it's a protected route, user must be authenticated
                if (isProtectedRoute) {
                    return !!token;
                }

                // For all other routes, allow access
                return true;
            },
        },
        pages: {
            signIn: `/auth/auto-signin`, // Redirect to auto-signin page
        },
    }
);

export const config = {
    matcher: [
        '/favourite/:path*',
        '/history/:path*',
        '/my-cart/:path*'
    ]
}; 