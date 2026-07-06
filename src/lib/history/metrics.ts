export function calculateRequestSize(options: {
    url: string;
    method: string;
    headers?: Record<string, string>;
    body?: string;
}) {
    return new TextEncoder().encode(
        JSON.stringify({
            url: options.url,
            method: options.method,
            headers: options.headers ?? {},
            body: options.body ?? '',
        }),
    ).length;
}

export function calculateResponseSize(body?: string) {
    return new TextEncoder().encode(body ?? '').length;
}

export function buildErrorDetails(options: {
    proxyError?: string;
    status?: number | null;
    statusText?: string;
    responseBody?: string;
}) {
    if (options.proxyError) {
        return options.proxyError;
    }

    if (
        options.status !== null &&
        options.status !== undefined &&
        options.status >= 400
    ) {
        const statusLabel = options.statusText
            ? `${options.status} ${options.statusText}`
            : String(options.status);

        if (options.responseBody) {
            return `${statusLabel}: ${options.responseBody.slice(0, 500)}`;
        }

        return statusLabel;
    }

    return null;
}
