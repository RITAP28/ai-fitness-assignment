import { ai } from "@/app/api/lib/utils";
import { dietPlan, foodItem, meal } from "@/db/schema/diet-schema";
import { db } from "@/lib/db";
import { IDietPlanProps, IFormDataProps } from "@/utils/interfaces";
import { Type } from "@google/genai"

interface IExerciseProps {
    id?: string
    name: string
    sets: string
    reps: string
    restTime: string
    imageUrl?: string
    exercise_description?: string
}

export const dietPlanGenerator = async (userId: string, dayId: string, focusArea: string, exercise: IExerciseProps[], formData: IFormDataProps) => {
    const { age, gender, height, weight, fitnessGoal, fitnessLevel, dietaryPref, medHistory, stressLevel } = formData;
    const exerciseList = exercise
        .map(
            (ex, index) =>
                `${index + 1}. ${ex.name} — ${ex.sets} sets x ${ex.reps} reps, Rest: ${ex.restTime}. Notes: ${ex.exercise_description}`
        )
        .join("\n");

    const prompt = `
    You are an AI Nutrition Expert. Generate a personalized 7-day diet plan based on user profile.

### User Profile
Age: ${age}
Gender: ${gender}
Height: ${height} cm
Weight: ${weight} kg
Fitness Goal: ${fitnessGoal}
Fitness Level: ${fitnessLevel}
Diet Preference: ${dietaryPref}
Medical History: ${medHistory || "None"}
Stress Level: ${stressLevel || "Not provided"}

### Muscle Focused today: **${focusArea}**

### Exercise for today:
${exerciseList}

### Diet Rules
- Provide a structured meal plan for this day, based on the exercises performed
- Each day must include:
  - Breakfast
  - Lunch
  - Snacks
  - Dinner
- Each meal should contain 3-5 food items
- Provide **quantity**, **macros** (protein, carbs, fats), and **calories** for each item
- Follow calorie target daily
- Consider medical history for food safety (e.g., avoid dairy if lactose intolerant)
- If stress level is high, include calming foods (e.g., leafy greens, omega-3 foods)
- Return response in JSON format **only**

Return ONLY JSON. No extra text.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        'caloriesTarget': {
                            type: Type.STRING,
                            description: ''
                        },
                        'dietPlan': {
                            type: Type.ARRAY,
                            description: '',
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    'mealType': {
                                        type: Type.STRING,
                                        description: "can be any one of the given options: 'breakfast' or 'lunch' or 'snacks' or 'dinner'"
                                    },
                                    'totalCalories': {
                                        type: Type.STRING,
                                        description: ''
                                    },
                                    'foodItems': {
                                        type: Type.ARRAY,
                                        description: '',
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                'name': {
                                                    type: Type.STRING,
                                                    description: ''
                                                },
                                                'quantity': {
                                                    type: Type.STRING,
                                                    description: ''
                                                },
                                                'calories': {
                                                    type: Type.STRING,
                                                    description: ''
                                                },
                                                'macros': {
                                                    type: Type.OBJECT,
                                                    properties: {
                                                        'protein': {
                                                            type: Type.STRING,
                                                            description: ''
                                                        },
                                                        'carbs': {
                                                            type: Type.STRING,
                                                            description: ''
                                                        },
                                                        'fats': {
                                                            type: Type.STRING,
                                                            description: ''
                                                        }
                                                    },
                                                    required: ['protein', 'carbs', 'fats'],
                                                    propertyOrdering: ['protein', 'carbs', 'fats']
                                                }
                                            },
                                            required: ['name', 'quantity', 'calories', 'macros'],
                                            propertyOrdering: ['name', 'quantity', 'calories', 'macros']
                                        }
                                    }
                                },
                                required: ['mealType', 'totalCalories', 'foodItems'],
                                propertyOrdering: ['mealType', 'totalCalories', 'foodItems']
                            },
                        }
                    },
                    required: ['caloriesTarget', 'dietPlan']
                }
            }
        });

        const generatedDietPlan = JSON.parse(response.text as string) as IDietPlanProps;
        console.log(`generated diet plan for ${dayId}: `, generatedDietPlan);

        const [savedDietPlan] = await db
            .insert(dietPlan)
            .values({
                userId: userId,
                dayId: dayId,
                dietPreference: dietaryPref === 'non_veg' ? 'non-veg' : dietaryPref as 'veg' | 'vegan' | 'keto' | 'non-veg',
                caloriesTarget: generatedDietPlan.caloriesTarget,
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now())
            })
            .returning();

        for (const diet of generatedDietPlan.dietPlan) {
            const [savedMeal] = await db
                .insert(meal)
                .values({
                    userId: userId,
                    dayId: dayId,
                    planId: savedDietPlan.id,
                    mealType: diet.mealType.toLowerCase(),
                    totalCalories: diet.totalCalories,
                    createdAt: new Date(Date.now()),
                    updatedAt: new Date(Date.now())
                })
                .returning();

            for (const item of diet.foodItems) {
                await db
                    .insert(foodItem)
                    .values({
                        userId: userId,
                        dayId: dayId,
                        planId: savedDietPlan.id,
                        mealId: savedMeal.id,
                        name: item.name,
                        quantity: item.quantity,
                        calories: item.calories,
                        protein: item.macros.protein,
                        carbs: item.macros.carbs,
                        fats: item.macros.fats,
                        createdAt: new Date(Date.now()),
                        updatedAt: new Date(Date.now())
                    })
            }
        }

        return generatedDietPlan;
    } catch (error) {
        console.error('error while generating diet plan: ', error);
        throw new Error('something went wrong while generating diet plan');
    };
};