import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { GoogleGenAI } from '@google/genai'
import serverConfig from "@/infrastructure/server.config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ai = new GoogleGenAI({ apiKey: serverConfig.GEMINI_API_KEY });
