'use client'

import { Button } from "@/components/ui/button";
import { IExerciseProps, IUserProps } from "@/utils/interfaces";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import DietModal from "../modals/dietModal";
import { Moon, Sun } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import Form from "../form";
import ExerciseModal from "../modals/exerciseModal";
import RegenerationForm from "../regenrate.form";
import ExportPdf from "./exportPDF";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Header from "./header";
import Quote from "./quote";

interface IPlanProps {
    user: IUserProps
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

export default function Plans({ user }: IPlanProps): React.ReactElement {
    const { theme } = useUIStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [formOpen, setFormOpen] = useState<boolean>(false);

    const [plans, setPlans] = useState<IClientWorkoutPlanProps[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
    const [selectedDiet, setSelectedDiet] = useState<IDietPlanProps | null>(null);

    const [regenerateModal, setRegenerateModal] = useState<boolean>(false);

    const [exerciseModal, setExerciseModal] = useState<boolean>(false);
    const [selectedExercise, setSelectedExercise] = useState<IExerciseProps | null>(null);

    const handleFetchWorkoutPlans = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`/api/plan/${user.id}`);
            if (response.status === 200) {
                console.log('plans fetched successfully: ', response.data);
                setPlans(response.data.workoutPlan);
            }
        } catch (error) {
            console.error('error while fetching workout plan: ', error);
            setError('something went wrong');
        } finally {
            setLoading(false);
        }
    }, [user.id]);

    useEffect(() => {
        handleFetchWorkoutPlans();
    }, [handleFetchWorkoutPlans]);

    return (
        <div className={`w-full min-h-screen flex justify-center bg-white dark:bg-black`}>
            <div className="w-full md:w-[80%] px-4 py-2">
            {loading ? (
                <div className="w-full h-full flex flex-col justify-center items-center gap-2">
                    <span className={`loader dark:border-white dark:border-r-transparent`} />
                    <p className={`${theme === 'dark' ? "text-white" : "text-gray-600"} tracking-tight`}>Getting your workout</p>
                </div>
            ) : error ? (
                <div className="w-full h-full flex justify-center items-center">
                    {error}
                </div>
            ) : (
                <div className="w-full flex flex-col">
                    <Header user={user} plans={plans} setRegenerateModal={setRegenerateModal} />
                    <Quote user={user} />
                    {/* <p className="tracking-tight text-2xl">Here is your workout + diet plan</p> */}
                    <div className="w-full flex flex-col py-4">
                        {plans.length === 0 ? (
                            <div className="w-full flex flex-col">
                                <div className="w-full h-full flex justify-center items-center tracking-tighter font-semibold dark:text-yellow-500">No workout plans found</div>
                                <div className="w-full flex justify-center items-center">
                                    <Button
                                        className="px-4 py-1 text-lg tracking-tighter font-semibold rounded-md hover:cursor-pointer bg-black text-white hover:bg-gray-800 transition duration-300 ease-in-out dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-yellow-500"
                                        onClick={() => setFormOpen(true)}
                                    >
                                        Create
                                    </Button>
                                </div>
                                {formOpen && <Form user={user} setFormOpen={setFormOpen} handleFetchWorkoutPlans={handleFetchWorkoutPlans} />}
                            </div>
                        ) : (
                            plans.map((plan, index) => (
                                <div key={index} className="w-full flex flex-col">
                                    <div className="w-full flex flex-col">
                                        <div className="w-full grid grid-cols-2 md:grid-cols-4">
                                            <div className="w-full flex flex-row gap-2">
                                                <p className="font-extralight">Fitness Goal:</p>
                                                <p className={`font-bold tracking-tight ${theme === 'dark' ? "text-yellow-500" : "text-black"}`}>{plan.fitnessGoal}</p>
                                            </div>
                                            <div className="w-full flex flex-row gap-2">
                                                <p className="font-extralight">Fitness Level:</p>
                                                <p className={`font-bold tracking-tight ${theme === 'dark' ? "text-yellow-500" : "text-black"}`}>{plan.fitnessLevel === 'beginner' ? "Beginner" : plan.fitnessLevel === 'advanced' ? "Advanced" : "Intermediate"}</p>
                                            </div>
                                            <div className="w-full flex flex-row gap-2">
                                                <p className="font-extralight">Workout Duration:</p>
                                                <p className={`font-bold tracking-tight ${theme === 'dark' ? "text-yellow-500" : "text-black"}`}>{plan.planDuration}</p>
                                            </div>
                                            <div className="w-full flex flex-row gap-2">
                                                <p className="font-extralight">Workout Location:</p>
                                                <p className={`font-bold tracking-tight ${theme === 'dark' ? "text-yellow-500" : "text-black"}`}>{plan.workoutLocation === 'home' ? "Home" : plan.workoutLocation === 'gym' ? "Gym" : "Outdoor"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full py-4">
                                        {plan.days.map((day, index) => (
                                            <div key={index} className="w-full flex flex-col py-2">
                                                <p className={`font-bold ${theme === 'dark' ? "text-yellow-500" : "text-black"} text-2xl tracking-tight`}>{day.day}</p>
                                                <p className="w-full text-lg tracking-tight font-extralight">Exercises:</p>
                                                <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-2 py-2">
                                                    {day.exercises.map((ex, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`w-full flex items-center flex-col p-2 rounded-lg hover:cursor-pointer dark:hover:bg-gray-900 dark:border-gray-900 hover:bg-gray-100 border-gray-100 border-[0.3px] transition duration-200 ease-in-out`}
                                                            onClick={() => {
                                                                setSelectedExercise(ex);
                                                                setExerciseModal(true);
                                                            }}
                                                        >
                                                            <span className="text-lg font-semibold py-2">{ex.name}</span>
                                                            <p className="w-full flex flex-row gap-2 text-sm">
                                                                <span className="w-[40%]">Sets: </span>
                                                                <span className="w-[60%]">{ex.sets}</span>
                                                            </p>
                                                            <p className="w-full flex flex-row gap-2 text-sm">
                                                                <span className="w-[40%]">Reps: </span>
                                                                <span className="w-[60%]">{ex.reps}</span>
                                                            </p>
                                                            <p className="w-full flex flex-row gap-2 text-sm">
                                                                <span className="w-[40%]">Rest Time: </span>
                                                                <span className="w-[60%]">{ex.restTime}</span>
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* diet */}
                                                <div className="w-full flex flex-col gap-2">
                                                    <p className="w-full text-lg tracking-tight font-extralight">Diet:</p>
                                                    <div className="w-full grid grid-cols-5 gap-2">
                                                        {/* {day.diet.meals.filter((d) => d.mealType === 'breakfast').map((m, idx) => (
                                                            <div key={idx} className="w-full">
                                                                <p className="">{m.name}</p>
                                                            </div>
                                                        ))} */}
                                                        <Button
                                                            className="bg-gray-200 hover:cursor-pointer hover:bg-gray-300 text-black transition duration-300 ease-in-out"
                                                            onClick={() => {
                                                                setSelectedDiet(day.diet)
                                                                setSelectedMealType("breakfast");
                                                                setModalOpen(true);
                                                            }}
                                                        >
                                                            Breakfast
                                                        </Button>
                                                        <Button
                                                            className="bg-gray-200 hover:cursor-pointer hover:bg-gray-300 text-black transition duration-300 ease-in-out"
                                                            onClick={() => {
                                                                setSelectedDiet(day.diet)
                                                                setSelectedMealType("lunch");
                                                                setModalOpen(true);
                                                            }}
                                                        >
                                                            Lunch
                                                        </Button>
                                                        <Button
                                                            className="bg-gray-200 hover:cursor-pointer hover:bg-gray-300 text-black transition duration-300 ease-in-out"
                                                            onClick={() => {
                                                                setSelectedDiet(day.diet)
                                                                setSelectedMealType("snacks");
                                                                setModalOpen(true);
                                                            }}
                                                        >
                                                            Snacks
                                                        </Button>
                                                        <Button
                                                            className="bg-gray-200 hover:cursor-pointer hover:bg-gray-300 text-black transition duration-300 ease-in-out"
                                                            onClick={() => {
                                                                setSelectedDiet(day.diet)
                                                                setSelectedMealType("dinner");
                                                                setModalOpen(true);
                                                            }}
                                                        >
                                                            Dinner
                                                        </Button>
                                                    </div>
                                                    {modalOpen && selectedDiet && selectedMealType && <DietModal user={user} setModalOpen={setModalOpen} diet={day.diet} setPlans={setPlans} selectedMealType={selectedMealType} handleFetchWorkoutPlans={handleFetchWorkoutPlans} loading={loading} error={error} />}
                                                    {plans && regenerateModal && <RegenerationForm user={user} planId={plans[0].id} setFormOpen={setRegenerateModal} handleFetchWorkoutPlans={handleFetchWorkoutPlans} />}
                                                    {selectedExercise && exerciseModal && <ExerciseModal user={user} item={selectedExercise} setPlans={setPlans} setModalOpen={setExerciseModal} setSelectedExercise={setSelectedExercise} handleFetchWorkoutPlans={handleFetchWorkoutPlans} />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {user && plans.length > 0 && <ExportPdf user={user} plan={plans} />}
                </div>
            )}
        </div> 
        </div>
    )
}