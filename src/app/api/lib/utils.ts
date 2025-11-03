import serverConfig from "@/infrastructure/server.config";
import { GoogleGenAI } from "@google/genai";
import { createClient } from '@supabase/supabase-js';

export const ai = new GoogleGenAI({ apiKey: serverConfig.GEMINI_API_KEY });

const supabase_project_url = serverConfig.SUPABASE_PROJECT_URL
const supabase_api_key = serverConfig.SUPABASE_API_KEY
export const supabase = createClient(supabase_project_url!, supabase_api_key!);