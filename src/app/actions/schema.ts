'use server';

import { revalidatePath } from 'next/cache';

import { parseSchema } from '@/lib/openapi/schema-parser';
import { createClient } from '@/lib/supabase/server';

export type SavedSchema = {
    content: string;
    format: 'json' | 'yaml';
};

export async function loadSavedSchema(): Promise<SavedSchema | undefined> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return undefined;
    }

    const { data } = await supabase
        .from('saved_schemas')
        .select('content, format')
        .eq('user_id', user.id)
        .maybeSingle();

    if (!data || (data.format !== 'json' && data.format !== 'yaml')) {
        return undefined;
    }

    return {
        content: data.content,
        format: data.format,
    };
}

export async function saveSchema(content: string) {
    const parsedSchema = parseSchema(content);

    if (!parsedSchema.ok) {
        return {
            ok: false,
            message: parsedSchema.error,
        };
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            ok: false,
            messageKey: 'editor.signInToSave',
        };
    }

    const { error } = await supabase.from('saved_schemas').upsert(
        {
            user_id: user.id,
            content,
            format: parsedSchema.format,
            updated_at: new Date().toISOString(),
        },
        {
            onConflict: 'user_id',
        },
    );

    if (error) {
        return {
            ok: false,
            message: error.message,
        };
    }

    revalidatePath('/');

    return {
        ok: true,
        messageKey: 'editor.schemaSaved',
    };
}
