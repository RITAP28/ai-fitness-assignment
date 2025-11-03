import { NextRequest, NextResponse } from "next/server";
import { verify } from 'jsonwebtoken';
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { session } from "@/db/schema/auth-schema";

const JWT_SECRET = process.env.BETTER_AUTH_SECRET as string;
export async function middleware(req: NextRequest) {
    const token = req.cookies.get('session-token')?.value;

    const protectedRoutes = ["/source"];

    // allowing public routes
    if (!protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
        return NextResponse.next();
    };

    // redirecting the user to /login page if no token is present
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    try {
        const decoded = verify(token, JWT_SECRET) as { userId: string };

        // checking if token exists and not revoked
        // if revoked or token does not exist, then user is redirected to login page
        const [existingSession] = await db.select().from(session).where(eq(session.token, token));
        if (!existingSession) return NextResponse.redirect(new URL("/login", req.url));

        const res = NextResponse.next();
        res.headers.set("x-user-id", decoded.userId);
        return res;
    } catch (error) {
        console.error("Auth Error: ", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }
};

export const config = {
    matcher: ["/source/:path*"]
};