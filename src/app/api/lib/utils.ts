import serverConfig from "@/infrastructure/server.config";
import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: serverConfig.GEMINI_API_KEY });