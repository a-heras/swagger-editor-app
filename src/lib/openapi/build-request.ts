import type { ApiEndpoint } from './types';

export function buildRequestUrl(
    baseUrl: string,
    endpoint: ApiEndpoint,
    pathParams: Record<string, string>,
    queryParams: Record<string, string>,
) {
    let path = endpoint.path;

    for (const [key, value] of Object.entries(pathParams)) {
        path = path.replace(`{${key}}`, encodeURIComponent(value));
    }

    const resolvedBase = baseUrl || 'http://localhost';
    const url = new URL(
        path,
        resolvedBase.endsWith('/') ? resolvedBase : `${resolvedBase}/`,
    );

    for (const [key, value] of Object.entries(queryParams)) {
        if (value) {
            url.searchParams.set(key, value);
        }
    }

    return url.toString();
}

export function buildRequestHeaders(
    headerParams: Record<string, string>,
    cookieParams: Record<string, string>,
    contentType?: string,
) {
    const headers: Record<string, string> = {};

    for (const [key, value] of Object.entries(headerParams)) {
        if (value) {
            headers[key] = value;
        }
    }

    const cookie = Object.entries(cookieParams)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');

    if (cookie) {
        headers.Cookie = cookie;
    }

    if (contentType) {
        headers['Content-Type'] = contentType;
    }

    return headers;
}

export function methodSupportsBody(method: string) {
    return !['GET', 'HEAD'].includes(method.toUpperCase());
}
