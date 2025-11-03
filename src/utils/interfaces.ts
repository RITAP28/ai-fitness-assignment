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
    stressLevel: number | null
}