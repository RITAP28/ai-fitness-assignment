'use client'

import { XIcon } from "lucide-react"
import React, { useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "../ui/input"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"
import { Button } from "../ui/button"
import axios from "axios"
import { IFormDataProps } from "@/utils/interfaces"

interface IFormProps {
    setFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Form({ setFormOpen }: IFormProps): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<IFormDataProps>({
    age: null,
    gender: 'male',
    height: null,
    weight: null,
    fitnessGoal: null,
    fitnessLevel: null,
    workoutLocation: null,
    dietaryPref: null,
    medHistory: null,
    stressLevel: null
  });

  const handleSubmit = async () => {
    try {
        console.log('formdata: ', formData);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(error?.response?.data?.error || "Form submission failed");
            setError(error?.response?.data?.error || "Form submission failed");
        } else {
            setError("Something went wrong. Please try again.");
            console.error("Something went wrong. Please try again.");
        }
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white text-black backdrop-blur-md backdrop-saturate-150 rounded-md shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* header details */}
            <div className="flex justify-between items-center pt-2 pb-2 px-4">
                <h2 className="text-lg font-semibold tracking-tight">Enter Details</h2>
                <button
                    className="text-gray-500 hover:cursor-pointer dark:bg-zinc-900 p-1 rounded-full dark:hover:bg-zinc-700 transition duration-200 ease-in-out dark:hover:text-teal-500 dark:text-zinc-400"
                    onClick={() => setFormOpen(false)}
                >
                    <XIcon className="h-4 w-4 transition ease-in-out duration-200" />
                </button>
            </div>

            {/* form body */}
            <div className="w-full flex flex-col gap-2 px-4 py-2">
                <div className="w-full flex flex-row items-center justify-between">
                    <p className="w-[30%] font-medium tracking-tight">Age</p>
                    <div className="w-[70%]">
                        <Input
                            name="age"
                            type="number"
                            placeholder="Enter age"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData({
                                    ...formData,
                                    age: Number(e.target.value)
                                })
                            }}
                        />
                    </div>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                    <p className="w-[30%] font-medium tracking-tight">Gender</p>
                    <div className="w-[70%] flex flex-row gap-4">
                        <RadioGroup 
                            value={formData.gender || undefined}
                            defaultValue="male"
                            onValueChange={(value) => setFormData({ ...formData, gender: value as "male" | "female" | "other" })}
                            className="flex flex-row"
                        >
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="male" id="r1" />
                            <Label htmlFor="r1">Male</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="female" id="r2" />
                            <Label htmlFor="r2">Female</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="other" id="r3" />
                            <Label htmlFor="r3">Other</Label>
                        </div>
                        </RadioGroup>
                    </div>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                    <p className="w-[30%] font-medium tracking-tight">Height</p>
                    <div className="w-[70%]">
                        <Input
                            name="height"
                            type="number"
                            placeholder="Enter height"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, height: Number(e.target.value) })}
                        />
                    </div>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                    <p className="w-[30%] font-medium tracking-tight">Weight</p>
                    <div className="w-[70%]">
                        <Input
                            name="weight"
                            type="number"
                            placeholder="Enter weight"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, weight: Number(e.target.value) })}
                        />
                    </div>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                    <label className="w-[30%] font-medium tracking-tight">Fitness Goal</label>
                    <div className="w-[70%]">
                        <Select onValueChange={(value) => setFormData({ ...formData, fitnessGoal: value as "weight_loss" | "muscle_gain" | "general_fitness" | "strength_training" })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a fitness goal" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="weight_loss">Weight Loss</SelectItem>
                                <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                                <SelectItem value="general_fitness">General Fitness</SelectItem>
                                <SelectItem value="strength_training">Strength Training</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                    <label className="w-[30%] font-medium tracking-tight">Current Fitness Level</label>
                    <div className="w-[70%]">
                        <Select onValueChange={(value) => setFormData({ ...formData, fitnessLevel: value as 'beginner' | 'intermediate' | 'advanced' })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your current fitness level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                    <label className="w-[30%] font-medium tracking-tight">Workout Location</label>
                    <div className="w-[70%]">
                        <Select onValueChange={(value) => setFormData({ ...formData, workoutLocation: value as "home" | "gym" | "outdoor" })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select workout location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="home">Home</SelectItem>
                                <SelectItem value="gym">Gym</SelectItem>
                                <SelectItem value="outdoor">Outdoor</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                    <label className="w-[30%] font-medium tracking-tight">Dietary Preferences</label>
                    <div className="w-[70%]">
                        <Select onValueChange={(value) => setFormData({ ...formData, dietaryPref: value as "veg" | "non_veg" | "vegan" | "keto" })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a dietary preference" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="veg">Veg</SelectItem>
                                <SelectItem value="non_veg">Non-Veg</SelectItem>
                                <SelectItem value="vegan">Vegan</SelectItem>
                                <SelectItem value="keto">Keto</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                    <label className="w-[30%] font-medium tracking-tight">Medical History</label>
                    <div className="w-[70%]">
                        <Select onValueChange={(value) => setFormData({ ...formData, medHistory: value as "other" | "diabetes" | "hypertension" | "asthma" | "back_pain" | "knee_joint_issues" | "heart_conditions" | "none" })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="diabetes">Diabetes</SelectItem>
                                <SelectItem value="hypertension">Hypertension</SelectItem>
                                <SelectItem value="asthma">Asthma</SelectItem>
                                <SelectItem value="back_pain">Back Pain</SelectItem>
                                <SelectItem value="knee_joint_issues">Knee/Joint Issues</SelectItem>
                                <SelectItem value="heart_conditions">Heart Condition</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                    <label className="w-[30%] font-medium tracking-tight">Stress Levels</label>
                    <div className="w-[70%]">
                        <Slider defaultValue={[33]} max={100} step={10} onValueChange={(value) => setFormData({ ...formData, stressLevel: value[0] })} />
                    </div>
                </div>
            </div>

            {/* button */}
            <div className="w-full flex justify-center items-center py-2">
                <Button onClick={handleSubmit}>Generate</Button>
            </div>
        </div>
    </div>
  )
}
