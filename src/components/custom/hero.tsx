'use client'

import { useState } from "react";
import { Button } from "../ui/button";
import Form from "./form";
import { IUserProps } from "@/utils/interfaces";
import { useRouter } from "next/navigation";

export default function Hero({ user } : { user: IUserProps }) {
    const router = useRouter();
    const [formOpen, setFormOpen] = useState<boolean>(false);
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div className="w-full flex flex-col justify-center items-center leading-tight">
          <p className="font-bold tracking-tighter text-[5rem]">
            Your Personal AI Fitness Coach
          </p>
          <p className="text-2xl tracking-tighter">
            Get a custom workout & diet plan in seconds — built just for you.
          </p>
        </div>
        <div className="pt-5">
          <Button
            className="bg-black text-white hover:cursor-pointer hover:bg-gray-700 tracking-tighter font-semibold text-lg hover:scale-105 transition duration-200 ease-in-out"
            onClick={() => {
                if (!user) {
                    router.push('/login');
                } else {
                    setFormOpen(true)
                }
            }}
          >
            Generate my first plan
          </Button>
        </div>
        {formOpen && <Form setFormOpen={setFormOpen} user={user} />}
      </div>
    )
}