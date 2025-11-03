import { ai } from "@/app/api/lib/utils";
import { exercise, workoutDay, workoutPlan } from "@/db/schema/workout-schema";
import { db } from "@/lib/db";
import { IFormDataProps, IFullWorkoutPlanProps, IWorkoutPlanProps } from "@/utils/interfaces";
import { Type } from "@google/genai"

export const workoutPlanGenerator = async (userId: string, formData: IFormDataProps) => {
    const { age, gender, height, weight, fitnessGoal, fitnessLevel, workoutLocation, medHistory, stressLevel, planDuration } = formData;

    const prompt = `
You are an AI Fitness Coach. Generate a personalized workout plan based on the user's profile.

### User Profile
Age: ${age}
Gender: ${gender}
Height: ${height} cm
Weight: ${weight} kg
Fitness Goal: ${fitnessGoal}
Fitness Level: ${fitnessLevel}
Workout Location: ${workoutLocation}
Medical History: ${medHistory || "None"}
Stress Level: ${stressLevel || "Not provided"}
Plan Duration: ${planDuration || "30 mins"}

### Workout Plan Rules
- Give a structured workout plan for **7 days**
- The plan for each day must be completed within the mentioned plan duration
- Each day must have:
  - A clear workout focus area (e.g., Chest & Triceps, Full Body, Legs)
  - 5-7 exercises
  - Sets and reps appropriate to fitness level
  - Rest time after each exercise
  - Short description/tips on how to perform the exercise
- Avoid unsafe exercises if medical history suggests so
- If stress level is high, include lighter days/rest/yoga stretching
- Format must strictly follow the JSON schema

Return ONLY the JSON response. No explanation text.
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
                        'days': {
                            type: Type.ARRAY,
                            description: 'A 7-day structured workout plan. Each item in the array represents one day of training.',
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    'day': {
                                        type: Type.STRING,
                                        description: 'The day label e.g., Monday, Tuesday.'
                                    },
                                    'focusArea': {
                                        type: Type.STRING,
                                        description: 'Primary muscle group or training theme of the day. Example: Full Body, Chest & Triceps, Cardio & Core, Stretching & Mobility.'
                                    },
                                    'exercises': {
                                        type: Type.ARRAY,
                                        description: 'List of exercises planned for the day.',
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                'name': {
                                                    type: Type.STRING,
                                                    description: 'The exercise name. Example: Push-ups, Squats, Jump Rope.'
                                                },
                                                'sets': {
                                                    type: Type.STRING,
                                                    description: 'Number of sets. Example: 3 sets, 4 sets.'
                                                },
                                                'reps': {
                                                    type: Type.STRING,
                                                    description: 'Repetition scheme. Example: 10–12 reps, 30 seconds.'
                                                },
                                                'restTime': {
                                                    type: Type.STRING,
                                                    description: 'Rest time between sets or exercises. Example: 60 seconds, 90 seconds.'
                                                },
                                                'exercise_description': {
                                                    type: Type.STRING,
                                                    description: 'Short form tips on how to perform the exercise safely. Example: Keep your back straight, breathe out when pushing up.'
                                                }
                                            },
                                            required: ['name', 'sets', 'reps', 'restTime', 'exercise_description'],
                                            propertyOrdering: ['name', 'sets', 'reps', 'restTime', 'exercise_description']
                                        },
                                    }
                                },
                                required: ['day', 'focusArea', 'exercises'],
                                propertyOrdering: ['day', 'focusArea', 'exercises']
                            },
                        }
                    },
                    required: ['days']
                }
            }
        });

        const generatedWorkoutPlan = JSON.parse(response.text as string) as IWorkoutPlanProps;
        console.log('generated response: ', generatedWorkoutPlan);

        // saving everything into the database before sending out the response
        // just to save the data first in order to prevent data loss
        const [savedWorkoutPlan] = await db
            .insert(workoutPlan)
            .values({
                userId: userId,
                fitnessGoal: fitnessGoal === 'general_fitness' ? 'General Fitness' : fitnessGoal === 'muscle_gain' ? 'Muscle Gain' : fitnessGoal === 'strength_training' ? 'Strength Training' : 'Weight Loss',
                fitnessLevel: fitnessLevel,
                workoutLocation: workoutLocation,
                planDuration: planDuration,
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now())
            })
            .returning()

        const fullWorkoutPlan: IFullWorkoutPlanProps = {
            id: savedWorkoutPlan.id,
            userId: savedWorkoutPlan.userId,
            fitnessGoal: savedWorkoutPlan.fitnessGoal,
            fitnessLevel: savedWorkoutPlan.fitnessLevel,
            workoutLocation: savedWorkoutPlan.workoutLocation,
            planDuration: savedWorkoutPlan.planDuration,
            days: [],
            createdAt: savedWorkoutPlan.createdAt,
            updatedAt: savedWorkoutPlan.updatedAt as Date
        };

        for (const day of generatedWorkoutPlan.days) {
            const [savedWorkoutDay] = await db
                .insert(workoutDay)
                .values({
                    userId: userId,
                    planId: savedWorkoutPlan.id,
                    day: day.day,
                    focusArea: day.focusArea,
                    createdAt: new Date(Date.now()),
                    updatedAt: new Date(Date.now())
                })
                .returning();

            for (const exer of day.exercises) {
                await db
                    .insert(exercise)
                    .values({
                        userId: userId,
                        planId: savedWorkoutPlan.id,
                        dayId: savedWorkoutDay.id,
                        name: exer.name,
                        sets: exer.sets,
                        reps: exer.reps,
                        restTime: exer.restTime,
                        description: exer.exercise_description
                    })
            }

            fullWorkoutPlan.days.push({
                id: savedWorkoutDay.id,
                day: savedWorkoutDay.day,
                focusArea: savedWorkoutDay.focusArea,
                exercises: day.exercises.map((ex) => ({
                    name: ex.name,
                    sets: ex.sets,
                    reps: ex.reps,
                    restTime: ex.restTime,
                }))
            });
        };

        return fullWorkoutPlan;
    } catch (error) {
        console.error('error while generating workout plan: ', error);
        throw new Error('something went wrong while generating workout plan');
    };
};