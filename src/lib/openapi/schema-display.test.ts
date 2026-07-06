import { describe, expect, it } from 'vitest';

import {
    formatExample,
    formatSchema,
    getMediaTypeExample,
    getSchemaExample,
    groupEndpointsByPath,
    groupParametersByLocation,
} from './schema-display';
import type { ApiEndpoint } from './types';

describe('groupParametersByLocation', () => {
    it('groups parameters by location', () => {
        const grouped = groupParametersByLocation([
            { name: 'id', in: 'path' },
            { name: 'q', in: 'query' },
            { name: 'auth', in: 'header' },
            { name: 'sid', in: 'cookie' },
        ]);

        expect(grouped.path).toHaveLength(1);
        expect(grouped.query).toHaveLength(1);
        expect(grouped.header).toHaveLength(1);
        expect(grouped.cookie).toHaveLength(1);
    });
});

describe('schema display helpers', () => {
    it('formats schema and examples', () => {
        expect(formatSchema(null)).toBe('—');
        expect(formatSchema({ type: 'string' })).toContain('"type": "string"');
        expect(formatExample(undefined)).toBe('—');
        expect(formatExample('plain')).toBe('plain');
        expect(formatExample({ ok: true })).toContain('"ok": true');
    });

    it('derives schema examples', () => {
        expect(getSchemaExample({ example: 'demo' })).toBe('demo');
        expect(getSchemaExample({ default: 10 })).toBe(10);
        expect(getSchemaExample({ enum: ['a', 'b'] })).toBe('a');
        expect(
            getSchemaExample({
                type: 'object',
                properties: {
                    name: { type: 'string' },
                },
            }),
        ).toEqual({ name: '' });
        expect(
            getSchemaExample({
                type: 'array',
                items: { type: 'integer' },
            }),
        ).toEqual([0]);
        expect(getSchemaExample({ type: 'boolean' })).toBe(false);
    });

    it('reads media type examples', () => {
        expect(
            getMediaTypeExample({
                example: { id: 1 },
            }),
        ).toEqual({ id: 1 });

        expect(
            getMediaTypeExample({
                examples: {
                    sample: { value: { ok: true } },
                },
            }),
        ).toEqual({ ok: true });

        expect(
            getMediaTypeExample({
                schema: { type: 'string' },
            }),
        ).toBe('');
    });
});

describe('groupEndpointsByPath', () => {
    it('sorts paths and methods', () => {
        const endpoints: ApiEndpoint[] = [
            {
                id: 'post-/users',
                path: '/users',
                method: 'post',
                parameters: [],
                responses: {},
            },
            {
                id: 'get-/users',
                path: '/users',
                method: 'get',
                parameters: [],
                responses: {},
            },
            {
                id: 'get-/health',
                path: '/health',
                method: 'get',
                parameters: [],
                responses: {},
            },
        ];

        const grouped = groupEndpointsByPath(endpoints);

        expect(grouped.map(([path]) => path)).toEqual(['/health', '/users']);
        expect(grouped[1]?.[1].map((endpoint) => endpoint.method)).toEqual([
            'get',
            'post',
        ]);
    });
});
