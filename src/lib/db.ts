import { neon } from "@neondatabase/serverless";
import { drizzle } from 'drizzle-orm/neon-http';
import * as userSchema from '@/db/schema/auth-schema';
import * as sessionSchema from '@/db/schema/auth-schema';

const prodUrl = process.env.PROD_DB_URL!;
const devUrl = process.env.DEV_DB_URL!;

const connectionString = process.env.NODE_ENV === "production" ? prodUrl : devUrl;

const sql = neon(connectionString);
export const db = drizzle(sql, {
    schema: {
        ...userSchema,
        ...sessionSchema
    }
});