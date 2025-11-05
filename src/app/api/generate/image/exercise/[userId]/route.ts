import { exercise } from "@/db/schema/workout-schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params } : { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    if (!userId) return NextResponse.json({ error: 'missing user id, bad request' }, { status: 400 });

    const body = await req.json();
    const { exerciseId, exerciseName } : { exerciseId: string, exerciseName: string } = body;
    if (!exerciseId || !exerciseName) return NextResponse.json({ error: 'missing fields in the request body' }, { status: 400 });

    const enhancedPrompt = `
    Create a high-resolution image demonstrating the exercise: **${exerciseName}**.

    Scene & Style:
        - Professional fitness studio or clean modern gym setting
        - Natural lighting or soft professional light
        - Neutral, minimal background (no distractions)
        - Realistic body proportions & natural movement
        - Full-body frame OR half-body depending on exercise
        - Strong sense of motion and correct posture/ form
        - Focus on muscles engaged in the exercise

    Subject Appearance:
        - Athletic & healthy physique
        - Wearing modern fitness clothing
        - Sweat-resistant dry fit outfit (no logos)
        - No faces clearly visible (face turned or cropped) — focus on the exercise

    Camera & Quality:
        - DSLR shot quality
        - 50mm lens, f/2.8 depth of field
        - High-detail texture and crisp motion focus
        - 4K resolution fitness photography

    Mood & Tone:
        - Motivational, energetic, powerful fitness vibe
        - Clean, modern, realistic, authentic training feel

    Important Rules:
        - No cartoon or digital character/AI look
        - No unrealistic poses or limbs
        - No extra gym crowd or clutter
        - Do NOT show company brands, logos, text, or watermarks
        - Ensure correct exercise form (avoid incorrect posture)
    `;

    try {
        // const response = await ai.models.generateContent({
        //     model: 'gemini-2.5-flash-image',
        //     contents: enhancedPrompt,
        //     config: {
        //         imageConfig: {
        //             aspectRatio: "16:9"
        //         }
        //     }
        // });
        // let imageUrl = null;
        // if (response.candidates?.[0]?.content?.parts) {
        //     for (const part of response.candidates[0].content.parts) {
        //         if (part.text) {
        //             console.log(part.text);
        //         } else if (part.inlineData) {
        //             const imageData = part.inlineData.data as string; // base64 string
        //             const buffer = Buffer.from(imageData, "base64");

        //             // upload to supabase
        //             imageUrl = await uploadGeneratedImage(buffer);
        //             console.log("Image saved to supabase storage");
        //         }
        //     }
        // }
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}`;
        if (!imageUrl) return NextResponse.json({ error: 'No image generated' }, { status: 500 });

        // updating the database with the image url of the exercise
        await db
            .update(exercise)
            .set({
                imageUrl: imageUrl,
            })
            .where(
                and(
                    eq(exercise.userId, userId),
                    eq(exercise.id, exerciseId)
                )
            )

        return NextResponse.json({
            success: true,
            message: 'Image generated successfully',
            imageUrl: imageUrl
        }, {
            status: 201
        });
    } catch (error) {
        console.error('error while creating an image: ', error);
        return NextResponse.json({ error: 'internal server error' }, { status: 500 });
    }
}