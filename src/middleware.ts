import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Security headers applied to every response */
const SECURITY_HEADERS: Record<string, string> = {
    // Prevent clickjacking
    'X-Frame-Options': 'SAMEORIGIN',
    // Stop MIME-type sniffing
    'X-Content-Type-Options': 'nosniff',
    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Disallow access to sensitive APIs from scripts
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    // Force HTTPS for all future requests (1 year)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    // Content Security Policy — allow same-origin plus trusted CDNs
    'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires these
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob: https:",
        "connect-src 'self'",
        "frame-src https://www.google.com", // Google Maps embed
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
    ].join('; '),
};

function addSecurityHeaders(response: NextResponse): NextResponse {
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    return response;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isAdminRoute = pathname.startsWith('/admin');
    const isLoginPage = pathname === '/admin/login';

    // ── Non-admin routes: just add security headers ──────
    if (!isAdminRoute) {
        return addSecurityHeaders(NextResponse.next());
    }

    // ── Admin login page: allow through (+ headers) ──────
    if (isLoginPage) {
        return addSecurityHeaders(NextResponse.next());
    }

    // ── Other admin routes: require a valid session token ─
    const token =
        request.cookies.get('next-auth.session-token')?.value ||
        request.cookies.get('__Secure-next-auth.session-token')?.value;

    if (!token) {
        const loginUrl = new URL('/admin/login', request.url);
        // Preserve the originally requested URL so login can redirect back
        loginUrl.searchParams.set('callbackUrl', pathname);
        const redirect = NextResponse.redirect(loginUrl);
        return addSecurityHeaders(redirect);
    }

    return addSecurityHeaders(NextResponse.next());
}

export const config = {
    // Run on admin routes but also on all other pages to inject security headers
    matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
