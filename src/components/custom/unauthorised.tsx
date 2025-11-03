"use client"

import { useRouter } from "next/navigation";

export default function Unauthorised() {
    const router = useRouter();
    return (
        <div className="w-full min-h-screen bg-cyan-300 flex justify-center items-center">
            <div className="flex flex-col gap-2">
                <div className="">Please Log In</div>
                <div className="">
                    <button
                        type="button"
                        className="px-4 py-1 border-[0.3px] border-gray-400 rounded-md hover:cursor-pointer bg-amber-400 hover:bg-amber-300 transition duration-300 ease-in-out"
                        onClick={() => router.push('/login')}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};