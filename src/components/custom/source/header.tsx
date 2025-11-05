"use client";

import React, { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import { authClient } from "@/lib/auth-client";
import { IUserProps } from "@/utils/interfaces";

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

interface IHeaderProps {
    user: IUserProps
    plans: IClientWorkoutPlanProps[]
    setRegenerateModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Header({ user, plans, setRegenerateModal }: IHeaderProps): React.ReactElement {
  const { theme, toggleTheme } = useUIStore();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = "px-4 py-1 bg-black font-bold dark:text-yellow-500 dark:hover:bg-gray-900 text-white hover:bg-gray-700 transition rounded-md tracking-tight";

  return (
    <header className="w-full">
      {/* Top Row */}
      <div className="flex justify-between items-center py-2">
        <p
          className={`text-4xl tracking-tighter font-semibold ${theme === "dark" ? "text-yellow-500" : "text-black"}`}
        >
          Welcome, {user.name}
        </p>

        {/* Desktop Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition"
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </button>

          {plans?.length > 0 && (
            <button className={linkClass} onClick={() => setRegenerateModal(true)}>
              Regenerate Plan
            </button>
          )}

          <button
            className={linkClass}
            onClick={() => {
              authClient.signOut();
              router.push("/");
            }}
          >
            Sign Out
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="sm:hidden flex flex-col justify-center gap-3 pb-4 animate-slideDown rounded-lg border-[0.3px] dark:border-gray-800">
          <button
            onClick={toggleTheme}
            className="flex justify-center items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            {theme === "light" ? <Moon /> : <Sun />}
            Toggle Theme
          </button>

          {plans?.length > 0 && (
            <button
              className={linkClass}
              onClick={() => {
                setRegenerateModal(true);
                setMobileOpen(false);
              }}
            >
              Regenerate Plan
            </button>
          )}

          <button
            className={linkClass}
            onClick={() => {
              authClient.signOut();
              router.push("/");
              setMobileOpen(false);
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
