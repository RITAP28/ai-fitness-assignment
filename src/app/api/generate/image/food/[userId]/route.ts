import { foodItem } from "@/db/schema/diet-schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/app/api/lib/utils";
import { uploadGeneratedImage } from "@/app/api/lib/uploadImage";

export async function POST(req: NextRequest, { params } : { params: { userId: string } }) {
    const { userId } = await params;
    if (!userId) return NextResponse.json({ error: 'missing user id, bad request' }, { status: 400 });

    const body = await req.json();
    const { itemId, foodName } : { itemId: string, foodName: string } = body;
    if (!itemId || !foodName) return NextResponse.json({ error: 'missing fields in the request body' }, { status: 400 });

    const enhancedPrompt = `
    Create a high-resolution image of ${foodName} served in a clean fitness-lifestyle style. Make it look healthy, fresh, and visually appealing.

    Photography Style:
        - Professional **studio lighting**
        - Clean and modern **minimal background**
        - Wooden table or white marble surface
        - Shallow depth of field
        - Sharp focus on food texture
        - Restaurant plating, macro shot

    Mood & Tone:
        - Healthy meal prep vibe
        - Fitness & wellness aesthetics
        - No labels, no text, no watermark

    Camera Style:
        - Shot on DSLR, 50mm portrait lens
        - f/1.8 depth of field
        - 4K resolution food photography

    Important Rules:
        - No humans
        - No cartoon look
        - No extra decorations — keep it natural
        - Realistic portion size for fitness diet
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

        // updating the database with the image url of the food item
        await db
            .update(foodItem)
            .set({
                imageUrl: imageUrl,
                updatedAt: new Date(Date.now())
            })
            .where(
                and(
                    eq(foodItem.userId, userId),
                    eq(foodItem.id, itemId)
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