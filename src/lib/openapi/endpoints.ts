import type { ApiEndpoint, HttpMethod, OpenApiDocument } from './types';

const httpMethods: HttpMethod[] = [
    'get',
    'post',
    'put',
    'patch',
    'delete',
    'options',
    'head',
    'trace',
];

function isHttpMethod(method: string): method is HttpMethod {
    return httpMethods.includes(method as HttpMethod);
}

export function getBaseUrl(document: OpenApiDocument): string {
    const serverUrl = document.servers?.[0]?.url?.trim();
    if (serverUrl) {
        return serverUrl;
    }

    const host = document.host?.trim();
    if (host) {
        const scheme = document.schemes?.[0] ?? 'https';
        const basePath = document.basePath ?? '';
        return `${scheme}://${host}${basePath}`;
    }

    return '';
}

export function extractEndpoints(document: OpenApiDocument): ApiEndpoint[] {
    if (!document.paths) {
        return [];
    }

    return Object.entries(document.paths).flatMap(([path, pathItem]) => {
        if (!pathItem) {
            return [];
        }

        return Object.entries(pathItem).flatMap(([method, operation]) => {
            if (!isHttpMethod(method) || !operation) {
                return [];
            }

            return {
                id: `${method}-${path}`,
                path,
                method,
                summary: operation.summary,
                description: operation.description,
                parameters: operation.parameters ?? [],
                requestBody: operation.requestBody,
                responses: operation.responses ?? {},
            };
        });
    });
}
