export interface IFormDataProps {
    age: number | null
    gender: "male" | "female" | "other" | null
    height: number | null
    weight: number | null
    fitnessGoal: "weight_loss" | "muscle_gain" | "general_fitness" | "strength_training" | null
    fitnessLevel: "beginner" | "intermediate" | "advanced" | null
    workoutLocation: "home" | "gym" | "outdoor" | null
    dietaryPref: "veg" | "non_veg" | "vegan" | "keto" | null
    medHistory: "diabetes" | "hypertension" | "asthma" | "back_pain" | "knee_joint_issues" | "heart_conditions" | "other" | "none" | null
    stressLevel: number | null,
    planDuration: string | null
}

export interface IWorkoutPlanProps {
    days: [{
        day: string
        focusArea: string
        exercises: [{
            name: string
            sets: string
            reps: string
            restTime: string
            exercise_description: string
        }]
    }]
};

export interface IDietPlanProps {
    caloriesTarget: string
    dietPlan: [{
        mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner',
        totalCalories: string
        foodItems: [{
            name: string
            quantity: string
            calories: string
            macros: {
                protein: string
                carbs: string
                fats: string
            }
        }]
    }]
}

export interface IUserProps {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
}