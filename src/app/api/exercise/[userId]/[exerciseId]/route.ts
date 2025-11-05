import { exercise } from "@/db/schema/workout-schema";
import { db } from "@/lib/db";
import { getExistingUser } from "@/utils/getExistingUser";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest, 
    { params } : { params: Promise<{ userId: string, exerciseId: string }> }
) {
    const { userId, exerciseId } = await params;
    
    if (!userId || !exerciseId) {
        return NextResponse.json({ error: 'missing params, bad request' }, { status: 400 });
    }
    
    try {
        const existingUser = await getExistingUser(userId);
        if (!existingUser) {
            return NextResponse.json({ error: 'existing user not found' }, { status: 404 });
        }
        
        const [existingExercise] = await db
            .select()
            .from(exercise)
            .where(
                and(
                    eq(exercise.id, exerciseId),
                    eq(exercise.userId, userId)
                )
            );
            
        if (!existingExercise) {
            return NextResponse.json({ error: 'existing exercise not found' }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            message: 'exercise fetched successfully',
            exercise: existingExercise
        }, {
            status: 200
        });
    } catch (error) {
        console.error('error while fetching exercise: ', error);
        return NextResponse.json({ error: 'internal server error' }, { status: 500 });
    }
}