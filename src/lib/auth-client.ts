import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    endpoints: {
        session: '/api/auth/session',
        signIn: '/api/auth/login',
        signUp: '/api/auth/register',
        signOut: '/api/auth/logout'
    },
    cookies: {
        sessionToken: 'session-token'
    }
});