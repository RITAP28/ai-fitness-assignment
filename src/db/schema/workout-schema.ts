import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { fitnessGoalEnum, fitnessLevelEnum, workoutLocationEnum } from "./enums";

export const workoutPlan = pgTable('workout_plan', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    fitnessGoal: fitnessGoalEnum().notNull(),
    fitnessLevel: fitnessLevelEnum().notNull(),
    workoutLocation: workoutLocationEnum().notNull(),
    planDuration: text('plan_duration').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
});

export const workoutDay = pgTable('workout_day', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    planId: uuid('plan_id').references(() => workoutPlan.id, { onDelete: 'cascade' }).notNull(),
    day: varchar('day', { length: 255 }).notNull(),
    focusArea: varchar('focus_area', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
});

export const exercise = pgTable('exercise', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    planId: uuid('plan_id').references(() => workoutPlan.id, { onDelete: 'cascade' }).notNull(),
    dayId: uuid('day_id').references(() => workoutDay.id, { onDelete: 'cascade' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    sets: text('sets').notNull(),
    reps: varchar('reps', { length: 255 }).notNull(),
    restTime: varchar('rest_time', { length: 255 }).notNull(),
    imageUrl: text('image_url'),
    description: text('description')
});