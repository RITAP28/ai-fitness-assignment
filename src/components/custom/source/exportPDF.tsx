import { IUserProps } from "@/utils/interfaces"
import axios from "axios"
import React, { useState } from "react"
import { toast } from "sonner"

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

interface IExportPDFProps {
    user: IUserProps
    plan: IClientWorkoutPlanProps[]
}

export default function ExportPdf({ plan }: IExportPDFProps): React.ReactElement {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const exportPlan = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/export-plan", {
                method: "POST",
                body: JSON.stringify({ plan })
            });

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "fitness-plan.pdf";
            a.click();
        } catch (error) {
            console.error('error while exporting pdf: ', error);
            toast.error('something went wrong. please try again');
            setError('something went wrong. please try again');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex justify-center items-center">
            <button
                className="bg-white text-black font-semibold tracking-tighter dark:text-yellow-500 dark:bg-gray-900 dark:hover:bg-gray-800 transition duration-300 ease-in-out hover:cursor-pointer px-4 py-2 rounded-md"
                onClick={() => exportPlan()}
            >
                {loading ? (
                    <span className="w-full flex flex-row items-center gap-1 justify-center">
                        <span className="loader" />
                        <span className="">Generating your PDF...</span>
                    </span>
                ) : (
                    <span className="">Export PDF</span>
                )}
            </button>
        </div>
    )
}