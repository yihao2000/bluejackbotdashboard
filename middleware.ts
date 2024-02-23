import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server'
import { queryValidateAdminAccess } from './app/utils/constants';

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
    } else if (path === '/channels' || path === '/services'){
        console.log('Validating Access for path: ' + path)

        //Validate if the requested url is /channels or /services, check user access from DB admin list
        if(session?.role! == 'admin'){
            console.log('Permit access');
            return NextResponse.next()
        }else{
            console.log('Deny access');
            return NextResponse.redirect(new URL('/', req.url))
        }
    } else {
        return NextResponse.next()
    }
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
