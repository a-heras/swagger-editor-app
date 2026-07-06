import { describe, expect, it } from 'vitest';

import { extractEndpoints, getBaseUrl } from './endpoints';
import type { OpenApiDocument } from './types';

const openApiDocument: OpenApiDocument = {
    openapi: '3.0.0',
    info: { title: 'Test', version: '1.0.0' },
    servers: [{ url: 'https://api.example.com' }],
    paths: {
        '/users': {
            get: {
                summary: 'List users',
                responses: { '200': { description: 'OK' } },
            },
            post: {
                summary: 'Create user',
                responses: { '201': { description: 'Created' } },
            },
            parameters: [{ name: 'ignored', in: 'invalid' as 'query' }],
        },
        '/empty': null as unknown as undefined,
    },
};

const swaggerDocument: OpenApiDocument = {
    swagger: '2.0',
    info: { title: 'Legacy', version: '1.0.0' },
    host: 'legacy.example.com',
    basePath: '/v1',
    schemes: ['http'],
    paths: {
        '/status': {
            get: {
                responses: { '200': { description: 'OK' } },
            },
        },
    },
};

describe('getBaseUrl', () => {
    it('reads OpenAPI 3 server url', () => {
        expect(getBaseUrl(openApiDocument)).toBe('https://api.example.com');
    });

    it('builds Swagger 2 base url', () => {
        expect(getBaseUrl(swaggerDocument)).toBe(
            'http://legacy.example.com/v1',
        );
    });

    it('returns empty string when no server info exists', () => {
        expect(
            getBaseUrl({
                openapi: '3.0.0',
                info: { title: 'No server', version: '1.0.0' },
                paths: {},
            }),
        ).toBe('');
    });
});

describe('extractEndpoints', () => {
    it('extracts http methods and ignores invalid operations', () => {
        const endpoints = extractEndpoints(openApiDocument);

        expect(endpoints).toHaveLength(2);
        expect(endpoints.map((endpoint) => endpoint.method)).toEqual([
            'get',
            'post',
        ]);
    });

    it('returns empty list without paths', () => {
        expect(
            extractEndpoints({
                openapi: '3.0.0',
                info: { title: 'Empty', version: '1.0.0' },
            }),
        ).toEqual([]);
    });
});
