import { user } from "@/db/schema/auth-schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function getExistingUser(userId: string) {
    try {
        const [existingUser] = await db.select().from(user).where(eq(user.id, userId));
        return existingUser;
    } catch (error) {
        console.error('error while fetching existing user: ', error);
        throw new Error('something went wrong while fetching user');
    }
}