import { AudioLines } from "lucide-react";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { IExerciseProps, IUserProps } from "@/utils/interfaces";

interface IVoicePlayerProps {
    user: IUserProps
    item: IExerciseProps
}

export default function VoicePlayer({ user, item }: IVoicePlayerProps): React.ReactElement {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const playAudio = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/tts/${user.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });

            const dataType = res.headers.get("Content-Type");
            if (dataType === "application/json") {
                const json = await res.json();
                if (json.fallback) {
                    throw new Error(json.error || "TTS request failed");
                }
            } else {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                audio.play();
                setIsPlaying(true);
                audio.onended = () => {
                    setIsPlaying(false);
                    URL.revokeObjectURL(url);
                };
            }
        } catch (err) {
            console.error("TTS Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex justify-end items-center">
            <Button
                className="px-4 py-1 rounded-md bg-gray-100 border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-yellow-500 transition duration-300 ease-in-out"
                onClick={playAudio}
                disabled={isLoading || isPlaying}
            >
                {isLoading || isPlaying ? (
                    <span className="">playing...</span>
                ) : (
                    <AudioLines />
                )}
            </Button>
            {isPlaying && (
                <Button onClick={() => setIsPlaying(false)}>
                    Stop
                </Button>
            )}
        </div>
    )
}