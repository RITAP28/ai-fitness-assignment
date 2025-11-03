import { ai } from "@/lib/utils"
import { IFormDataProps } from "@/utils/interfaces";
import { Type } from "@google/genai"

export const workoutPlanGenerator = async (formData: IFormDataProps) => {
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
                        exerciseName: {
                            type: Type.STRING,
                            description: ''
                        },
                        sets: {
                            type: Type.STRING,
                            description: ''
                        },
                        reps: {
                            type: Type.STRING,
                            description: ''
                        },
                        restTime: {
                            type: Type.STRING,
                            description: ''
                        }
                    },
                    required: ['exerciseName', 'sets', 'reps', 'restTime']
                }
            }
        });

        return response;
    } catch (error) {
        console.error('error while generating workout plan: ', error);
        throw new Error('something went wrong while generating workout plan');
    };
};