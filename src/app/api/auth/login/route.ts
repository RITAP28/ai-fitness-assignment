import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { session, user } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) return NextResponse.json({ error: 'missing email or password, bad request.' }, { status: 400 });

    if (typeof password !== "string" || password.length < 8) return NextResponse.json({ error: 'password must be string and at least 8 characters long' });

    try {
        // loginResult gives an object with an 'id' as a field
        // which co-relates to the authClientId of the register schema
        const loginResult = await auth.api.signInEmail({
            body: {
                email: email,
                password: password
            }
        });
        
        const loggedUser = await db.select().from(user).where(eq(user.id, loginResult.user.id));
        const activeSession = await db.select().from(session).where(eq(session.userId, loginResult.user.id));

        return NextResponse.json(
            {
                message: 'Login successful',
                user: loggedUser,
                session: activeSession
            },
            {
                status: 200
            }
        );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('error while logging in user: ', error);
        if (error.message?.includes('Invalid') || error.message?.includes('credentials')) {
            return NextResponse.json(
                { error: 'Invalid email or password' }, 
                { status: 401 }
            );
        };
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}