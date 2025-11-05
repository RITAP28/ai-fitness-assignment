import { IExerciseProps, IUserProps } from "@/utils/interfaces"
import { XIcon } from "lucide-react"
import React from "react"
import ExerciseImgComponent from "../exerciseImage"
import VoicePlayer from "../voicePlayer"

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

interface IExerciseModalProps {
    user: IUserProps
    item: IExerciseProps
    setPlans: React.Dispatch<React.SetStateAction<IClientWorkoutPlanProps[]>>
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedExercise: React.Dispatch<React.SetStateAction<IExerciseProps | null>>
    handleFetchWorkoutPlans: () => Promise<void>
}

export default function ExerciseModal({ user, item, setPlans, setModalOpen, setSelectedExercise }: IExerciseModalProps): React.ReactElement {
    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-gray-900 flex items-center justify-center p-4 z-50">
            <div className="bg-white text-black dark:bg-black dark:text-yellow-500 backdrop-blur-md backdrop-saturate-150 rounded-md shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                {/* header details */}
                <div className="flex justify-between items-center pt-2 pb-2 px-4">
                    <h2 className="text-lg font-semibold tracking-tight">
                        {item.name}
                    </h2>
                    <button
                        className="text-gray-500 hover:cursor-pointer dark:bg-zinc-900 p-1 rounded-full dark:hover:bg-zinc-700 transition duration-200 ease-in-out dark:hover:text-teal-500 dark:text-zinc-400"
                        onClick={() => {
                            setSelectedExercise(null)
                            setModalOpen(false)
                        }}
                    >
                        <XIcon className="h-4 w-4 transition ease-in-out duration-200" />
                    </button>
                </div>

                {/* main information */}
                <div className="w-full flex flex-col gap-2 p-4">
                    {/* exercise image */}
                    <div className="w-full h-60 bg-gray-100 dark:bg-black rounded-md">
                        <ExerciseImgComponent type={'exercise'} user={user} item={item} setPlans={setPlans} imageUrl={item.imageUrl} />
                    </div>
                    {/* exercise metadata */}
                    <div className="w-full flex flex-col gap-1">
                        <div className="w-full flex flex-row gap-2">
                            <p className="font-light w-[20%]">Sets: </p>
                            <p className="font-semibold tracking-tighter w-[80%]">{item.sets}</p>
                        </div>
                        <div className="w-full flex flex-row gap-2">
                            <p className="font-light w-[20%]">Reps: </p>
                            <p className="font-semibold tracking-tighter w-[80%]">{item.reps}</p>
                        </div>
                        <div className="w-full flex flex-row gap-2">
                            <p className="font-light w-[20%]">Rest Time: </p>
                            <p className="font-semibold tracking-tighter w-[80%]">{item.restTime}</p>
                        </div>
                        <div className="w-full flex flex-row gap-2">
                            <p className="font-light w-[20%]">Description: </p>
                            <p className="font-semibold tracking-tighter w-[80%]">{item.description}</p>
                        </div>
                    </div>
                    <VoicePlayer user={user} item={item} />
                </div>
            </div>
        </div>
    )
}