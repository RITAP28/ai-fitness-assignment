import { getExistingUser } from "@/utils/getExistingUser";
import { NextRequest, NextResponse } from "next/server";
import { eleven_labs_api_key } from "../../lib/utils";
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { Readable } from "stream";
import { audioPlanGenerator } from "@/services/audioPlan";

export async function POST(req: NextRequest, { params } : { params: { userId: string } }) {
    const { userId } = await params;
    if (!userId) return NextResponse.json({ error: 'missing user id, bad request' }, { status: 400 });

    const body = await req.json();
    // const item = JSON.parse(body);
    console.log('item: ', body);
    // if (!item) return NextResponse.json({ error: 'missing text from request body, bad request' }, { status: 400 });

    const audioText = await audioPlanGenerator(body.name, body.sets, body.reps, body.restTime) as { text: string };
    if (!audioText.text) {
        return NextResponse.json({ error: 'something went wrong while generating audio' }, { status: 500 });
    };
    
    const enhancedAudioText = audioText.text;

    const apiKey = eleven_labs_api_key;
    if (!apiKey) return NextResponse.json({ error: 'voice could not be played due to missing api key' }, { status: 500 });

    const elevenLabsClient = new ElevenLabsClient({ apiKey });

    try {
        const existingUser = await getExistingUser(userId);
        if (!existingUser) return NextResponse.json({ error: 'no existing user found' }, { status: 404 });

        const audio = await elevenLabsClient.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
            text: enhancedAudioText,
            modelId: 'eleven_multilingual_v2',
            outputFormat: 'mp3_44100_128',
        });

        const chunks: Uint8Array[] = [];
        const reader = audio.getReader();
        let done, value;

        while (true) {
            ({ done, value } = await reader.read());
            if (done) break;
            if (value) chunks.push(value);
        }

        const buffer = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
        console.log('buffer: ', buffer);

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Length": buffer.length.toString(),
            },
        });
    } catch (error) {
        console.error('error while playing voice: ', error);
        return NextResponse.json({
            success: false,
            message: 'internal server error'
        }, {
            status: 500
        })
    }
}