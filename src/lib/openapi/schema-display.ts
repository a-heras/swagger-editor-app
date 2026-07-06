import type { ApiEndpoint, OpenApiMediaType, OpenApiSchema } from './types';

export function groupParametersByLocation<
    T extends { in?: 'path' | 'query' | 'header' | 'cookie' },
>(parameters: T[]) {
    return {
        path: parameters.filter((parameter) => parameter.in === 'path'),
        query: parameters.filter((parameter) => parameter.in === 'query'),
        header: parameters.filter((parameter) => parameter.in === 'header'),
        cookie: parameters.filter((parameter) => parameter.in === 'cookie'),
    };
}

export function formatSchema(schema: unknown): string {
    if (!schema) {
        return '—';
    }

    try {
        return JSON.stringify(schema, null, 2);
    } catch {
        return String(schema);
    }
}

export function getSchemaExample(schema?: OpenApiSchema): unknown {
    if (!schema) {
        return undefined;
    }

    if (schema.example !== undefined) {
        return schema.example;
    }

    if (schema.default !== undefined) {
        return schema.default;
    }

    if (schema.enum?.length) {
        return schema.enum[0];
    }

    if (schema.type === 'object' && schema.properties) {
        return Object.fromEntries(
            Object.entries(schema.properties).map(([key, value]) => [
                key,
                getSchemaExample(value),
            ]),
        );
    }

    if (schema.type === 'array' && schema.items) {
        return [getSchemaExample(schema.items)];
    }

    if (schema.type === 'string') {
        return '';
    }

    if (schema.type === 'number' || schema.type === 'integer') {
        return 0;
    }

    if (schema.type === 'boolean') {
        return false;
    }

    return undefined;
}

export function getMediaTypeExample(mediaType?: OpenApiMediaType): unknown {
    if (!mediaType) {
        return undefined;
    }

    if (mediaType.example !== undefined) {
        return mediaType.example;
    }

    const firstNamedExample = Object.values(mediaType.examples ?? {})[0];
    if (firstNamedExample?.value !== undefined) {
        return firstNamedExample.value;
    }

    return getSchemaExample(mediaType.schema);
}

export function formatExample(example: unknown): string {
    if (example === undefined) {
        return '—';
    }

    if (typeof example === 'string') {
        return example;
    }

    try {
        return JSON.stringify(example, null, 2);
    } catch {
        return String(example);
    }
}

const methodOrder = [
    'get',
    'post',
    'put',
    'patch',
    'delete',
    'options',
    'head',
    'trace',
] as const;

export function groupEndpointsByPath(endpoints: ApiEndpoint[]) {
    const map = new Map<string, ApiEndpoint[]>();

    for (const endpoint of endpoints) {
        const list = map.get(endpoint.path) ?? [];
        list.push(endpoint);
        map.set(endpoint.path, list);
    }

    return [...map.entries()]
        .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
        .map(
            ([path, pathEndpoints]) =>
                [
                    path,
                    [...pathEndpoints].sort(
                        (left, right) =>
                            methodOrder.indexOf(left.method) -
                            methodOrder.indexOf(right.method),
                    ),
                ] as const,
        );
}
