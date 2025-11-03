import { dietPlan, foodItem, meal } from "@/db/schema/diet-schema";
import { exercise, workoutDay, workoutPlan } from "@/db/schema/workout-schema";
import { db } from "@/lib/db";
import { getExistingUser } from "@/utils/getExistingUser";
import { IFullWorkoutPlanProps } from "@/utils/interfaces";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface IDietPlanProps {
    dietPreference: "veg" | "non-veg" | "vegan" | "keto",
    caloriesTarget: string
    meals: {
        mealType: string
        totalCalories: string
        name: string
        quantity: string
        calories: string
        macros: {
            protein: string
            carbs: string
            fats: string
        },
        imageUrl?: string
    }[]
}

interface IWorkoutPlanProps {
    id: string
    userId: string
    fitnessGoal: "Weight Loss" | "Muscle Gain" | "General Fitness" | "Strength Training"
    fitnessLevel: "beginner" | "intermediate" | "advanced"
    workoutLocation: "home" | "gym" | "outdoor"
    planDuration: string
    days: {
        id: string
        userId?: string
        planId?: string
        day: string
        focusArea: string
        exercises: {
            id?: string
            name: string
            sets: string
            reps: string
            restTime: string
            imageUrl?: string
            description?: string
        }[],
        diet: IDietPlanProps
    }[],
    createdAt: Date
    updatedAt: Date
}

export async function GET(req: NextRequest, { params } : { params : { userId: string } }) {
    const { userId } = await params;
    if (!userId) return NextResponse.json({ error: 'missing user id, bad request' }, { status: 400 });

    try {
        const existingUser = await getExistingUser(userId);
        if (!existingUser) return NextResponse.json({ error: 'existing user not found' }, { status: 404 });

        const plans = (await db.select().from(workoutPlan).where(eq(workoutPlan.userId, userId)));
        const allPlans = [] as IFullWorkoutPlanProps[];

        for (const plan of plans) {
            const fullWorkoutPlan: IWorkoutPlanProps = {
            id: plan.id,
            userId: plan.userId,
            fitnessGoal: plan.fitnessGoal,
            fitnessLevel: plan.fitnessLevel,
            workoutLocation: plan.workoutLocation,
            planDuration: plan.planDuration,
            days: [],
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt as Date
        };

        const workoutDays = await db.select().from(workoutDay).where(
            and(
                eq(workoutDay.userId, userId),
                eq(workoutDay.planId, plan.id)
            )
        );

        for (const day of workoutDays) {
            // for the exercise information for every single day
            const exercisesList = await db.select().from(exercise).where(
                and(
                    eq(exercise.userId, userId),
                    eq(exercise.planId, plan.id),
                    eq(exercise.dayId, day.id)
                )
            );

            // for the diet information for every single day
            const diet = (await db.select().from(dietPlan).where(and(eq(dietPlan.userId, userId), eq(dietPlan.dayId, day.id))))[0];
            // getting 4 types of meals - breakfast, lunch, snacks, dinner
            const diet_meals = await db.select().from(meal).where(and(eq(meal.userId, userId), eq(meal.dayId, day.id), eq(meal.planId, diet.id)));

            const diet_object: IDietPlanProps = {
                dietPreference: diet.dietPreference,
                caloriesTarget: diet.caloriesTarget,
                meals: []
            };

            for (const meal of diet_meals) {
                const diet_food_items = await db.select().from(foodItem).where(
                    and(
                        eq(foodItem.userId, userId),
                        eq(foodItem.dayId, day.id),
                        eq(foodItem.mealId, meal.id),
                        eq(foodItem.planId, diet.id)
                    )
                );

                diet_food_items.map((item) => {
                    diet_object.meals.push({
                        mealType: meal.mealType,
                        totalCalories: meal.totalCalories as string,
                        name: item.name,
                        quantity: item.quantity,
                        calories: item.calories as string,
                        macros: {
                            protein: item.protein,
                            carbs: item.carbs,
                            fats: item.fats
                        },
                        imageUrl: item.imageUrl ?? ''
                    })
                })
            };

            // entering all the exercises list & diet information into the object
            fullWorkoutPlan.days.push({
                id: day.id,
                userId: day.userId,
                planId: day.planId,
                day: day.day,
                focusArea: day.focusArea,
                exercises: exercisesList.map(ex => ({
                    id: ex.id,
                    name: ex.name,
                    sets: ex.sets,
                    reps: ex.reps,
                    restTime: ex.restTime,
                    imageUrl: ex.imageUrl ?? undefined,
                    description: ex.description as string
                })),
                diet: diet_object
            });
        };

            allPlans.push(fullWorkoutPlan);
        }

        console.log('full workout plan: ', allPlans);
        return NextResponse.json({
            success: false,
            message: 'workout plan fetched successfully',
            workoutPlan: allPlans
        }, {
            status: 200
        });
    } catch (error) {
        console.error('error while fetching plans: ', error);
        return NextResponse.json({ error: 'internal server error' }, { status: 500 });
    }
}