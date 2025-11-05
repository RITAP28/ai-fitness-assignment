import { dietPlanGenerator } from "@/services/dietPlan";
import { workoutPlanGenerator } from "@/services/workoutPlan";
import { getExistingUser } from "@/utils/getExistingUser";
import { IFormDataProps } from "@/utils/interfaces";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params } : { params : Promise<{ userId: string }> }) {
    const { userId } = await params;
    if (!userId) return NextResponse.json({ error: 'missing user id, bad request' }, { status: 400 });

    const body = await req.json();
    const { formData } : { formData: IFormDataProps } = body;
    console.log('formdata: ', formData);
    
    if (!formData.age || 
        !formData.gender || 
        !formData.height || 
        !formData.weight ||
        !formData.fitnessGoal || 
        !formData.fitnessLevel || 
        !formData.dietaryPref || 
        !formData.workoutLocation || 
        !formData.medHistory || 
        !formData.stressLevel ||
        !formData.planDuration
    ) return NextResponse.json({ error: 'all fields are required' }, { status: 400 });
    
    try {
        const existingUser = await getExistingUser(userId);
        if (!existingUser) return NextResponse.json({ error: 'existing user not found' }, { status: 404 });

        const dietPlan = [];

        const generatedWorkoutPlan = await workoutPlanGenerator(existingUser.id, formData);
        console.log('generated workout plan: ', generatedWorkoutPlan);
        for (const day of generatedWorkoutPlan.days) {
            console.log(`Name of the day: ${day.day}: `, day);
            const generatedDietPlan = await dietPlanGenerator(existingUser.id, day.id, day.focusArea, day.exercises, formData);
            dietPlan.push(generatedDietPlan);
        }

        return NextResponse.json({
            success: true,
            message: 'new workout plan and diet plan generated successfully',
            workoutPlan: generatedWorkoutPlan,
            dietPlan: dietPlan,
        }, {
            status: 201
        });
    } catch (error) {
        console.error('error while processing form: ', error);
        return NextResponse.json({ error: 'internal server error' }, { status: 500 });
    }
}