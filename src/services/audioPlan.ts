import { ai } from "@/app/api/lib/utils";
import { Type } from "@google/genai";

export const audioPlanGenerator = async (name: string, sets: string, reps: string, restTime: string) => {
    const prompt = `
        Given is the information about the exercise:
        Name of the exercise: ${name}
        Sets advised: ${sets}
        Reps advised: ${reps}
        Rest Time between sets: ${restTime}

        Frame a sentence which includes all the information given about the exercise and which can be told in a good manner.
        Think of you have to say the exercise and all the info in a properly constructed sentence.
        Now make the sentence.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        'text': {
                            type: Type.STRING,
                            description: 'Based on the prompt, construct a proper sentence about the exercise and give a response here'
                        }
                    },
                    required: ['text']
                }
            }
        });

        const generatedAudiotext = JSON.parse(response.text as string);
        console.log('generated audio text: ', generatedAudiotext);

        return generatedAudiotext;
    } catch (error) {
        console.error('error while generating audio text: ', error);
        throw new Error('something went wrong while generating audio text');
    }
}