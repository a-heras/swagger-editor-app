import { NextResponse } from 'next/server';

import { recordRequestHistory } from '@/lib/history/record-request';

type ProxyRequestBody = {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    body?: string;
};

export async function POST(request: Request) {
    const payload = (await request.json()) as ProxyRequestBody;
    const { url, method = 'GET', headers = {}, body: requestBody } = payload;

    if (!url || typeof url !== 'string') {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const startedAt = Date.now();
    const normalizedMethod = method.toUpperCase();

    try {
        const response = await fetch(url, {
            method: normalizedMethod,
            headers,
            body: ['GET', 'HEAD'].includes(normalizedMethod)
                ? undefined
                : requestBody,
        });

        const text = await response.text();
        const responseHeaders: Record<string, string> = {};
        const durationMs = Date.now() - startedAt;

        response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
        });

        await recordRequestHistory({
            method: normalizedMethod,
            url,
            headers,
            body: requestBody,
            status: response.status,
            durationMs,
            statusText: response.statusText,
            responseHeaders,
            responseBody: text,
        });

        return NextResponse.json({
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
            body: text,
            durationMs,
        });
    } catch (error) {
        const durationMs = Date.now() - startedAt;
        const message =
            error instanceof Error ? error.message : 'Request failed';

        await recordRequestHistory({
            method: normalizedMethod,
            url,
            headers,
            body: requestBody,
            status: null,
            durationMs,
            proxyError: message,
        });

        return NextResponse.json(
            {
                error: message,
                durationMs,
            },
            { status: 502 },
        );
    }
}
