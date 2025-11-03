import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { dietaryPrefEnum, fitnessGoalEnum, fitnessLevelEnum, genderEnum, medHistory, workoutLocationEnum } from "./enums";
import { user } from "./auth-schema";

export const userDetails = pgTable("user_detail", {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    age: text('age').notNull(),
    gender: genderEnum().default('male').notNull(),
    height: text('height').notNull(),
    weight: text('weight').notNull(),
    fitnessGoal: fitnessGoalEnum().notNull(),
    fitnessLevelEnum: fitnessLevelEnum().notNull(),
    workoutLocation: workoutLocationEnum().notNull(),
    dietaryPref: dietaryPrefEnum().notNull(),
    medHistory: medHistory().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
});