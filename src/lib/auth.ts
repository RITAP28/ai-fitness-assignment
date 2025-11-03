import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg'
    }),
    emailAndPassword: {
        enabled: true
    },
    advanced: {
        useSecureCookies: true
    },
    session: {
        expiresIn: 60 * 60 * 24 * 15, // 15 Days
        updateAge: 60 * 60 * 24 // 1 Day
    },
    plugins: [nextCookies()]
});