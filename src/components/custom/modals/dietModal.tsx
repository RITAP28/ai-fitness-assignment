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

interface IDietModalProps {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    diet: IDietPlanProps
    selectedMealType: string | null
    user: IUserProps
    handleFetchWorkoutPlans: () => Promise<void>
    loading: boolean
    error: string | null
}

export default function DietModal({ setModalOpen, diet, selectedMealType, user, handleFetchWorkoutPlans, loading, error }: IDietModalProps): React.ReactElement {
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white text-black backdrop-blur-md backdrop-saturate-150 rounded-md shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* header details */}
                <div className="flex justify-between items-center pt-2 pb-2 px-4">
                    <h2 className="text-lg font-semibold tracking-tight">{selectedMealType?.toUpperCase()}</h2>
                    <button
                        className="text-gray-500 hover:cursor-pointer dark:bg-zinc-900 p-1 rounded-full dark:hover:bg-zinc-700 transition duration-200 ease-in-out dark:hover:text-teal-500 dark:text-zinc-400"
                        onClick={() => setModalOpen(false)}
                    >
                        <XIcon className="h-4 w-4 transition ease-in-out duration-200" />
                    </button>
                </div>

                {/* modal body */}
                <div className="w-full flex flex-col gap-2 px-4 py-2">
                    <div className="w-full grid grid-cols-3 gap-1">
                    {diet.meals
                        .filter(d => d.mealType.toLowerCase() === selectedMealType?.toLowerCase())
                        .map((item, idx) => (
                            <div key={idx} className="w-full border-[0.3px] border-gray-200 p-4 rounded-md">
                                <FoodCard item={item} user={user} handleFetchWorkoutPlans={handleFetchWorkoutPlans} fetchLoading={loading} fetchError={error} />
                            </div>
                        ))
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}