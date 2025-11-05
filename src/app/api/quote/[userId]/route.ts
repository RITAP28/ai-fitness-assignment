import { getExistingUser } from "@/utils/getExistingUser";
import { NextRequest, NextResponse } from "next/server";
import { ai } from "../../lib/utils";
import { Type } from "@google/genai";

export async function POST(req: NextRequest, { params } : { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    if (!userId) return NextResponse.json({ error: 'missing user id, bad request' }, { status: 400 });

    try {
        const existingUser = await getExistingUser(userId);
        if (!existingUser) return NextResponse.json({ error: 'existing user not found' }, { status: 404 });

        const prompt = ``;

        const quote = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        'quote': {
                            type: Type.STRING,
                            description: 'Give a quote to motivate the user to do workout everyday along with eating healthy.'
                        }
                    },
                    required: ['quote']
                }
            }
        });

        const generatedQuote = JSON.parse(quote.text as string) as { quote: string };

        return NextResponse.json({
            success: true,
            message: `Quote generated successfully`,
            quote: generatedQuote.quote
        }, {
            status: 201
        });
    } catch (error) {
        console.error('error while generating quote: ', error);
        return NextResponse.json({ error: 'internal server error' }, { status: 500 });
    }
}