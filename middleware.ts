import {withAuth} from "next-auth/middleware";
import {NextRequest, NextResponse} from "next/server";

const publicRoutes = ["/", "/login", "/register", "/forgot-password"];

export const middleware = withAuth(
    (req: NextRequest & { nextauth: any })=> {
        const pathname = req.nextUrl.pathname
        const token = req.nextauth.token

        if (publicRoutes.includes(pathname)) {
            return NextResponse.next()
        }

        if (!token) {
            const loginUrl = new URL('/login', req.url)
            loginUrl.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(loginUrl)
        }

        const roleBasedRoutes: Record<string, string[]> = {}
    }
)