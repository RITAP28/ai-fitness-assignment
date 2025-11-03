import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { dietaryPrefEnum, mealType } from "./enums";
import { user } from "./auth-schema";

export const dietPlan = pgTable('diet_plan', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    dietPreference: dietaryPrefEnum().notNull(),
    caloriesTarget: text('calories_target').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
});

export const meal = pgTable('meal', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    planId: uuid('plan_id').references(() => dietPlan.id, { onDelete: 'cascade' }).notNull(),
    mealType: mealType().notNull(),
    totalCalories: text('total_calories'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
});

export const foodItem = pgTable('diet_food_item', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    planId: uuid('plan_id').references(() => dietPlan.id, { onDelete: 'cascade' }).notNull(),
    mealId: uuid('meal_id').references(() => meal.id, { onDelete: 'cascade' }).notNull(),
    name: varchar('item_name', { length: 255 }).notNull(),
    quantity: text('item_quantity').notNull(),
    calories: text('calories'),
    protein: text('protein').notNull(),
    carbs: text('carbs').notNull(),
    fats: text('fats').notNull(),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
});