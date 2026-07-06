import { NextResponse } from 'next/server';

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

    try {
        const response = await fetch(url, {
            method: method.toUpperCase(),
            headers,
            body: ['GET', 'HEAD'].includes(method.toUpperCase())
                ? undefined
                : requestBody,
        });

        const text = await response.text();
        const responseHeaders: Record<string, string> = {};

        response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
        });

        return NextResponse.json({
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
            body: text,
            durationMs: Date.now() - startedAt,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error ? error.message : 'Request failed',
                durationMs: Date.now() - startedAt,
            },
            { status: 502 },
        );
    }
}
