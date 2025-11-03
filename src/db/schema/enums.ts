import { pgEnum } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum('user_gender', ['male', 'female', 'other']);
export const fitnessGoalEnum = pgEnum('fitness_goal', ['Weight Loss', 'Muscle Gain', 'General Fitness', 'Strength Training']);
export const fitnessLevelEnum = pgEnum('fitness_level', ['beginner', 'intermediate', 'advanced'])
export const workoutLocationEnum = pgEnum('workout_location', ['home', 'gym', 'outdoor']);
export const dietaryPrefEnum = pgEnum('dietary_pref', ['veg', 'non-veg', 'vegan', 'keto']);
export const mealType = pgEnum('meal_type', ['breakfast', 'lunch', 'snacks', 'dinner']);
export const medHistory = pgEnum('med_history', ['diabetes', 'hypertension', 'asthma', 'back_pain', 'knee_joint_issues', 'heart_conditions', 'other', 'none']);
