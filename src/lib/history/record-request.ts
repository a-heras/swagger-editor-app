import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

import {
    buildErrorDetails,
    calculateRequestSize,
    calculateResponseSize,
} from './metrics';

type RecordRequestHistoryInput = {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: string;
    status: number | null;
    durationMs: number;
    responseHeaders?: Record<string, string>;
    responseBody?: string;
    proxyError?: string;
    statusText?: string;
};

export async function recordRequestHistory(input: RecordRequestHistoryInput) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return;
    }

    const requestConfig = {
        url: input.url,
        method: input.method,
        headers: input.headers,
        body: input.body,
    };

    const { error } = await supabase.from('request_history').insert({
        user_id: user.id,
        method: input.method.toUpperCase(),
        url: input.url,
        status: input.status,
        duration_ms: input.durationMs,
        request_size: calculateRequestSize(requestConfig),
        response_size: calculateResponseSize(input.responseBody),
        error_details:
            buildErrorDetails({
                proxyError: input.proxyError,
                status: input.status,
                statusText: input.statusText,
                responseBody: input.responseBody,
            }) ?? null,
        request_headers: input.headers ?? null,
        request_body: input.body ?? null,
        response_headers: input.responseHeaders ?? null,
        response_body: input.responseBody ?? null,
    });

    if (error) {
        console.error('Failed to record request history:', error.message);
        return;
    }

    revalidatePath('/history');
}
