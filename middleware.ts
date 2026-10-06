import { NextRequest, NextResponse } from "next/server";
import {auth} from "@/lib/auth.ts";

export async function middleware(request: NextRequest) {
    const session = await auth();
    const pathname = request.nextUrl.pathname;

    // Routes publiques
    const publicRoutes = ["/", "/login", "/signup", "/practitioners"];
    const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Routes protégées praticien
    const practitionerRoutes = ["/dashboard"];
    const isPractitionerRoute = practitionerRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Si on est sur une route publique
    if (isPublicRoute) {
        // Si on a une session et qu'on essaie d'accéder à login/signup
        // if (
        //     session &&
        //     (pathname.startsWith("/login") || pathname.startsWith("/signup"))
        // ) {
        //     return NextResponse.redirect(new URL("/", request.url));
        // }
        return NextResponse.next();
    }

    // Si on n'a pas de session
    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Routes praticien
    if (isPractitionerRoute && (session.user as any)?.role !== "PRACTITIONER") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};