import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/register", "/forgot-password"];

export const middleware = withAuth((req: NextRequest & { nextauth: any }) => {
  const pathname = req.nextUrl.pathname;
  const token = req.nextauth.token;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const roleBasedRoutes: Record<string, string[]> = {
    practitioner: [
        "/dashboard/practitioner",
        "/appointments/manage",
        "/availability",
        "/patients"
    ],
    patient: [
        "/dashboard/patient",
        "/search",
        "/appointment/book",
        "/my-appointments"
    ],
  };

  const userRole = token.role as string;
  const allowedRoutes = roleBasedRoutes[userRole] || []

  const isAllowed = allowedRoutes.some((route) =>  pathname.startsWith(route));

  if (!isAllowed && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(
        new URL(
            userRole === 'practitioner' ? '/dashboard/practitioner' : '/dashboard/patient',
            req.url
        )
    );
  }

  return NextResponse.next()
},
{
  callbacks: {
    authorized: ({token}) => !!token
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"]
}

