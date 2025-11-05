import { XIcon } from "lucide-react"
import React from "react"
import FoodCard from "../source/foodCard"
import { IUserProps } from "@/utils/interfaces"

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

interface IDietModalProps {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    diet: IDietPlanProps
    selectedMealType: string | null
    user: IUserProps
    handleFetchWorkoutPlans: () => Promise<void>
    loading: boolean
    error: string | null
    setPlans: React.Dispatch<React.SetStateAction<IClientWorkoutPlanProps[]>>
}

export default function DietModal({ setModalOpen, diet, selectedMealType, user, setPlans, loading, error }: IDietModalProps): React.ReactElement {
    if (loading) return (
        <div className="w-full flex justify-center items-center">
            <span className="loader" />
        </div>
    );

    if (error) return (
        <div className="w-full flex justify-center items-center">
            <p className="text-sm font-medium tracking-tight">
                {error}
            </p>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-gray-900 flex items-center justify-center p-4 z-50">
            <div className="bg-white text-black dark:bg-black dark:text-yellow-500 backdrop-blur-md backdrop-saturate-150 rounded-md shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* header details */}
                <div className="flex justify-between items-center pt-2 pb-2 px-4">
                    <h2 className="text-lg font-semibold tracking-tight">{selectedMealType?.toUpperCase()}</h2>
                    <button
                        className="text-gray-500 hover:cursor-pointer dark:hover:bg-zinc-900 p-1 rounded-full transition duration-200 ease-in-out dark:text-zinc-400"
                        onClick={() => setModalOpen(false)}
                    >
                        <XIcon className="h-4 w-4 transition ease-in-out duration-200" />
                    </button>
                </div>

                {/* modal body */}
                <div className="w-full flex flex-col gap-2 px-4 py-2">
                    <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-1">
                    {diet.meals
                        .filter(d => d.mealType.toLowerCase() === selectedMealType?.toLowerCase())
                        .map((item, idx) => (
                            <div key={idx} className="w-full border-[0.3px] border-gray-200 dark:border-gray-800 p-4 rounded-md">
                                <FoodCard item={item} user={user} setPlans={setPlans} fetchLoading={loading} fetchError={error} />
                            </div>
                        ))
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}