import { v4 as uuidv4 } from 'uuid'
import { supabase } from './utils';

export async function uploadGeneratedImage(imageBuffer: Buffer) {
    const fileName = `${uuidv4()}.png`;

    const { error } = await supabase.storage
        .from("ai-fitness-images")
        .upload(`generated/${fileName}`, imageBuffer, {
            contentType: "image/png",
            upsert: false
        })

    if (error) throw error;

    const { data } = supabase.storage
        .from("ai-fitness-images")
        .getPublicUrl(`generated/${fileName}`)

    return data.publicUrl;
};