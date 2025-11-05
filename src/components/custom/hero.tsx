'use client'

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "../ui/button";
import { IUserProps } from "@/utils/interfaces";
import { useRouter } from "next/navigation";

export default function Hero({ user } : { user: IUserProps }) {
  const router = useRouter();

  // Refs for animation targets
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" }});

    tl.from(titleRef.current, { opacity: 0, y: 40 })
      .from(subtitleRef.current, { opacity: 0, y: 40 }, "-=0.4")
      .from(buttonRef.current, { opacity: 0, y: 30 }, "-=0.4");
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center px-4">
      <div className="w-full flex flex-col justify-center items-center leading-tight">
        <p ref={titleRef} className="font-bold tracking-tighter text-[5rem] text-center">
          Your Personal AI Fitness Coach
        </p>
        <p ref={subtitleRef} className="text-2xl tracking-tighter text-center">
          Get a custom workout & diet plan in seconds — built just for you.
        </p>
      </div>

      <div className="pt-5" ref={buttonRef}>
        {user ? (
          <Button
            className="bg-black text-white dark:text-yellow-500 hover:cursor-pointer hover:bg-gray-700 tracking-tighter font-semibold text-lg hover:scale-105 transition duration-200 ease-in-out"
            onClick={() => router.push('/source')}
          >
            Go to your workout
          </Button>
        ) : (
          <Button
            className="bg-black text-white dark:text-yellow-500 hover:cursor-pointer hover:bg-gray-700 tracking-tighter font-semibold text-lg hover:scale-105 transition duration-200 ease-in-out"
            onClick={() => router.push('/login')}
          >
            Get Started
          </Button>
        )}
      </div>
    </div>
  )
}
