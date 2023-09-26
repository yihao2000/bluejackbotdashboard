import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const session = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });
    if (!session && path != '/auth/login') {
        return NextResponse.redirect(new URL('/auth/login', req.url))
    } else if (session && path === '/auth/login') {
        return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
  };