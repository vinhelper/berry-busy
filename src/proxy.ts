import { NextResponse, type NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

// Optimistic auth guard (Next.js 16 `proxy` convention, runs on the Node.js
// runtime). It only checks for the presence of the session cookie — it does NOT
// validate the session against the database (that happens in the page/route via
// `auth.api.getSession`). Its job is just to bounce obviously-signed-out
// visitors away from protected routes quickly.
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/boards', '/boards/:path*'],
};
