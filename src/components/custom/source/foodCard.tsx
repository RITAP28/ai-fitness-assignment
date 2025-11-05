'use client'

import { IUserProps } from "@/utils/interfaces";
import React from "react";
import FoodImgComponent from "../foodImage";

interface IFoodItemProps {
    itemId: string
    mealType: string;
    totalCalories: string;
    name: string;
    quantity: string;
    calories: string;
    macros: {
        protein: string;
        carbs: string;
        fats: string;
    };
    imageUrl?: string | undefined;
}

interface IDietPlanProps {
    dietPreference: "veg" | "non-veg" | "vegan" | "keto",
    caloriesTarget: string
    meals: {
        itemId: string
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

interface IClientWorkoutPlanProps {
    id: string
    userId: string
    fitnessGoal: "Weight Loss" | "Muscle Gain" | "General Fitness" | "Strength Training"
    fitnessLevel: "beginner" | "intermediate" | "advanced"
    workoutLocation: "home" | "gym" | "outdoor"
    planDuration: string
    days: {
        id: string
        userId: string
        planId: string
        day: string
        focusArea: string
        exercises: {
            id: string
            name: string
            sets: string
            reps: string
            restTime: string
            imageUrl?: string
            description: string
        }[],
        diet: IDietPlanProps
    }[],
    createdAt: Date
    updatedAt: Date
}

interface IFoodItemModalProps {
    item: IFoodItemProps
    user: IUserProps
    fetchLoading: boolean
    fetchError: string | null
    setPlans: React.Dispatch<React.SetStateAction<IClientWorkoutPlanProps[]>>
}

export default function FoodCard({ item, user, setPlans }: IFoodItemModalProps): React.ReactElement {
    return (
        <div className="w-full flex flex-col tracking-tight">
            <div className="w-full h-30 bg-gray-200 dark:bg-black rounded-md flex justify-center items-center">
                <FoodImgComponent user={user} item={item} imageUrl={item.imageUrl} setPlans={setPlans}  /> 
            </div>
            <div className="w-full flex flex-row gap-2 pt-2">
                <p className="w-[30%] font-light">Name: </p>
                <p className="w-[70%] font-medium">{item.name}</p>
            </div>
            <div className="w-full flex flex-row gap-2">
                <p className="w-[30%] font-light">Quantity: </p>
                <p className="w-[70%] font-medium">{item.quantity}</p>
            </div>
            <div className="w-full flex flex-row gap-2">
                <p className="w-[30%] font-light">Calories: </p>
                <p className="w-[70%] font-medium">{item.calories}</p>
            </div>
            <div className="w-full flex flex-row gap-2">
                <p className="w-[30%] font-light">Proteins: </p>
                <p className="w-[70%] font-medium">{item.macros.protein}</p>
            </div>
            <div className="w-full flex flex-row gap-2">
                <p className="w-[30%] font-light">Carbs: </p>
                <p className="w-[70%] font-medium">{item.macros.carbs}</p>
            </div>
            <div className="w-full flex flex-row gap-2">
                <p className="w-[30%] font-light">Fats: </p>
                <p className="w-[70%] font-medium">{item.macros.fats}</p>
            </div>
        </div>
    )
}