import { dietPlanGenerator } from "@/services/dietPlan";
import { workoutPlanGenerator } from "@/services/workoutPlan";
import { getExistingUser } from "@/utils/getExistingUser";
import { IFormDataProps } from "@/utils/interfaces";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { formData } : { formData: IFormDataProps } = body;
    if (!formData.age || 
        !formData.gender || 
        !formData.height || 
        !formData.weight ||
        !formData.fitnessGoal || 
        !formData.fitnessLevel || 
        !formData.dietaryPref || 
        !formData.workoutLocation || 
        !formData.medHistory || 
        !formData.stressLevel
    ) return NextResponse.json({ error: 'all fields are required' }, { status: 400 });
    
    try {
        const workoutPlan = await workoutPlanGenerator(formData);
        const dietPlan = await dietPlanGenerator(formData);

    } catch (error) {
        console.error('error while processing form: ', error);
        return NextResponse.json({ error: 'internal server error' }, { status: 500 });
    }
}