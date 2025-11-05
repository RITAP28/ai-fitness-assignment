import React, { useState } from "react"
import { Button } from "../ui/button"
import axios from "axios";
import { IExerciseProps, IUserProps } from "@/utils/interfaces";
import { toast } from "sonner";

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

interface IImageProps {
    type: 'food' | 'exercise'
    user: IUserProps
    item: IExerciseProps
    imageUrl: string | undefined
    setPlans: React.Dispatch<React.SetStateAction<IClientWorkoutPlanProps[]>>
}

export default function ExerciseImgComponent({ user, item, imageUrl, setPlans }: IImageProps): React.ReactElement {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [image, setImage] = useState<string | undefined>(imageUrl);

    const handleCreateImage = async () => {
        setLoading(true);
        setError(null);

        const promise = axios.post(`/api/generate/image/exercise/${user.id}`, {
            exerciseId: item.id,
            exerciseName: item.name
        });

        toast.promise(promise, {
            loading: `Generating image for ${item.name}`,
            success: "Image generated successfully",
            error: "Failed to generate image :("
        });

        try {
            const response = await promise;
            if (response.status === 201) {
                setImage(response.data.imageUrl);
                setPlans((prev) => 
                    prev.map((plan) => ({
                        ...plan,
                        days: plan.days.map((day) => ({
                            ...day,
                            exercises: day.exercises.map((ex) => ex.id === item.id ? { ...ex, imageUrl: response.data.imageUrl } : ex)
                        }))
                    }))
                );
            }
        } catch (error) {
            setError('something went wrong. please try again');
        } finally {
            setLoading(false);
        }
    };

    return image ? (
        <div className="w-full h-full">
            <img src={image} alt="" className="w-full h-full object-contain" />
        </div>
    ) : (
        <div className="w-full h-full flex justify-center items-center">
            <Button className="" onClick={handleCreateImage} disabled={loading}>
                {loading ? (
                        <span className="loader" />
                ) : "Create Image"}
            </Button>
            {error && <p className="text-sm tracking-tighter text-red-400">{error}</p>}
        </div>
    )
}