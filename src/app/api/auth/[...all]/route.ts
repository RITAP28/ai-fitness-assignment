import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

export async function GET(req: NextRequest) {
    if (req.url.includes('/api/auth/session')) {
        try {
            const sessionToken = req.cookies.get('session-token')?.value;
            if (!sessionToken) {
                return NextResponse.json({ error: 'No session token' }, { status: 401 });
            };

            const session = await auth.api.getSession({
                headers: await headers()
            });

            if (!session) return NextResponse.json({ error: 'invalid session' }, { status: 401 });
            return NextResponse.json(session);
        } catch (error) {
            console.error('session error: ', error);
            return NextResponse.json({ error: 'session error' }, { status: 500 });
        }
    };

    return handler.GET(req);
};

export const { POST } = handler;