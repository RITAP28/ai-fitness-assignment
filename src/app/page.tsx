"use client"

import Form from "@/components/custom/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [formOpen, setFormOpen] = useState<boolean>(false);

  return (
    <div className="w-full min-h-screen bg-gray-100 text-black">
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
            onClick={() => setFormOpen(true)}
          >
            Generate my first plan
          </Button>
        </div>
        {formOpen && <Form setFormOpen={setFormOpen} />}
      </div>
    </div>
  );
}
