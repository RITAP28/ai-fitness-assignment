import { ai } from "@/lib/utils"
import { IFormDataProps } from "@/utils/interfaces";
import { Type } from "@google/genai"

export const dietPlanGenerator = async (formData: IFormDataProps) => {
    const prompt = ``;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        breakfast: {
                            type: Type.STRING,
                            description: ''
                        },
                        lunch: {
                            type: Type.STRING,
                            description: ''
                        },
                        snacks: {
                            type: Type.STRING,
                            description: ''
                        },
                        dinner: {
                            type: Type.STRING,
                            description: ''
                        }
                    },
                    required: ['breakfast', 'lunch', 'snacks', 'dinner']
                }
            }
        });

        return response;
    } catch (error) {
        console.error('error while generating diet plan: ', error);
        throw new Error('something went wrong while generating diet plan');
    };
};