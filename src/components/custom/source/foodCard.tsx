'use client'

import { Button } from "@/components/ui/button";
import { IUserProps } from "@/utils/interfaces";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

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

interface IFoodItemModalProps {
    item: IFoodItemProps
    user: IUserProps
    handleFetchWorkoutPlans: () => Promise<void>
    fetchLoading: boolean
    fetchError: string | null
}

export default function FoodCard({ item, user, handleFetchWorkoutPlans }: IFoodItemModalProps): React.ReactElement {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateImage = async () => {
        setLoading(true);
        setError(null);

        const promise = axios.post(`/api/generate/image/${user.id}`, {
            itemId: item.itemId,
            foodName: item.name
        });

        toast.promise(promise, {
            loading: `Generating image for ${item.name}`,
            success: "Image generated successfully",
            error: "Failed to generate image :("
        });

        try {
            const response = await promise;
            if (response.status === 201) {
                console.log('image generation successfull');
                handleFetchWorkoutPlans();
            }
        } catch (error) {
            console.error('error while creating image: ', error);
            setError('something went wrong. please try again.')
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col tracking-tight">
            <div className="w-full h-20 bg-gray-200 rounded-md flex justify-center items-center">
                {item.imageUrl ? (
                    <Image src={item.imageUrl} alt="" />
                ) : (
                    <Button
                        className="flex justify-center items-center"
                        onClick={handleCreateImage}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loader" />
                        ) : "Create Image"}
                    </Button>
                )}
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