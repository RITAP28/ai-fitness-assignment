import { relations } from "drizzle-orm";
import { account, user } from "./auth-schema";
import { userDetails } from "./user-details-schema";
import { exercise, workoutDay, workoutPlan } from "./workout-schema";
import { dietPlan, foodItem, meal } from "./diet-schema";

export const userRelations = relations(user, ({ many }) => ({
    account: many(account),
    details: many(userDetails),
    workoutPlan: many(workoutPlan),
    workoutDay: many(workoutDay),
    exercise: many(exercise),
    dietPlan: many(dietPlan),
    meal: many(meal),
    foodItem: many(foodItem)
}));

export const detailsRelation = relations(userDetails, ({ one }) => ({
    user: one(user, {
        fields: [userDetails.userId],
        references: [user.id]
    })
}));

export const workoutPlanRelation = relations(workoutPlan, ({ one, many }) => ({
    user: one(user, {
        fields: [workoutPlan.userId],
        references: [user.id]
    }),
    days: many(workoutDay),
    exercises: many(exercise)
}));

export const workoutDayRelation = relations(workoutDay, ({ one, many }) => ({
    user: one(user, {
        fields: [workoutDay.userId],
        references: [user.id]
    }),
    plan: one(workoutPlan, {
        fields: [workoutDay.planId],
        references: [workoutPlan.id]
    }),
    exercises: many(exercise),
    dietPlans: many(dietPlan),
    meals: many(meal),
    foodItems: many(foodItem)
}));

export const exerciseRelation = relations(exercise, ({ one }) => ({
    user: one(user, {
        fields: [exercise.userId],
        references: [user.id]
    }),
    plan: one(workoutPlan, {
        fields: [exercise.planId],
        references: [workoutPlan.id]
    }),
    day: one(workoutDay, {
        fields: [exercise.dayId],
        references: [workoutDay.id]
    })
}));

export const dietPlanRelation = relations(dietPlan, ({ one, many }) => ({
    user: one(user, {
        fields: [dietPlan.userId],
        references: [user.id]
    }),
    day: one(workoutDay, {
        fields: [dietPlan.dayId],
        references: [workoutDay.id]
    }),
    meals: many(meal),
    items: many(foodItem)
}));

export const mealRelations = relations(meal, ({ one, many }) => ({
    user: one(user, {
        fields: [meal.userId],
        references: [user.id]
    }),
    day: one(workoutDay, {
        fields: [meal.dayId],
        references: [workoutDay.id]
    }),
    plan: one(dietPlan, {
        fields: [meal.planId],
        references: [dietPlan.id]
    }),
    items: many(foodItem)
}));

export const foodItemRelations = relations(foodItem, ({ one }) => ({
    user: one(user, {
        fields: [foodItem.userId],
        references: [user.id]
    }),
    day: one(workoutDay, {
        fields: [foodItem.dayId],
        references: [workoutDay.id]
    }),
    plan: one(dietPlan, {
        fields: [foodItem.planId],
        references: [dietPlan.id]
    }),
    meal: one(meal, {
        fields: [foodItem.mealId],
        references: [meal.id]
    })
}));