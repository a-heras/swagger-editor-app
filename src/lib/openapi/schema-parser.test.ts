import { describe, expect, it } from 'vitest';

import { convertSchemaFormat, parseSchema } from './schema-parser';

const yamlSchema = `openapi: 3.0.0
info:
    title: Test API
    version: 1.0.0
paths:
    /health:
        get:
            responses:
                '200':
                    description: OK
`;

const jsonSchema = JSON.stringify(
    {
        openapi: '3.0.0',
        info: { title: 'JSON API', version: '1.0.0' },
        paths: {
            '/health': {
                get: {
                    responses: {
                        '200': { description: 'OK' },
                    },
                },
            },
        },
    },
    null,
    2,
);

describe('parseSchema', () => {
    it('parses valid yaml schema', () => {
        const result = parseSchema(yamlSchema);

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.format).toBe('yaml');
            expect(result.document.info.title).toBe('Test API');
        }
    });

    it('parses valid json schema', () => {
        const result = parseSchema(jsonSchema);

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.format).toBe('json');
        }
    });

    it('rejects unknown format', () => {
        const result = parseSchema('not json or yaml');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.format).toBe('yaml');
            expect(result.error).toBeTruthy();
        }
    });

    it('returns parse errors for invalid json', () => {
        const result = parseSchema('{invalid json');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.format).toBe('yaml');
            expect(result.error).toBeTruthy();
        }
    });

    it('returns validation errors for incomplete schema', () => {
        const result = parseSchema('{"openapi":"3.0.0"}');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toContain('info object');
        }
    });
});

describe('convertSchemaFormat', () => {
    it('converts yaml to json', () => {
        const converted = convertSchemaFormat(yamlSchema, 'json');

        expect(converted).toContain('"openapi": "3.0.0"');
    });

    it('converts json to yaml', () => {
        const converted = convertSchemaFormat(jsonSchema, 'yaml');

        expect(converted).toContain('openapi: 3.0.0');
    });

    it('throws when source schema is invalid', () => {
        expect(() => convertSchemaFormat('{bad', 'yaml')).toThrow();
    });
});
