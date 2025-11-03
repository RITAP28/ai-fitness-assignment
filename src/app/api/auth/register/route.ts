import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import validator from 'validator';
import { auth } from "@/lib/auth";
import { session, user } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";


export async function POST(req: NextRequest) {
    // checking and validating the inputs
    const body = await req.json();
    const { name, email, password } = body;
    if (!name || !email || !password) return NextResponse.json({ error: 'missing username, email or password. bad request' }, { status: 400 });

    if (!validator.isEmail(email)) return NextResponse.json({ error: 'invalid email format' }, { status: 400 });
    if (typeof password !== "string" || password.length < 8) return NextResponse.json({ error: 'password must be string and at least, 8 characters long' }, { status: 400 });

    try {
        // main authClient signup operation
        const result = await auth.api.signUpEmail({
            body: {
                email: email as string,
                name: name as string,
                password: password,
            }
        });

        const newUser = await db.select().from(user).where(eq(user.id, result.user.id));
        const newSession = await db.select().from(session).where(eq(session.userId, result.user.id));

        return NextResponse.json(
            {
                message: 'Registration successful',
                user: newUser,
                session: newSession
            },
            {
                status: 201
            }
        );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('error while registering user: ', error);

        if (error.message?.includes('already exists')) {
            return NextResponse.json(
                { error: 'User with this email already exists' }, 
                { status: 409 }
            );
        };

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}