import YAML from 'yaml';

import { detectSchemaFormat } from './schema-format';
import type {
    OpenApiDocument,
    ParsedSchemaResult,
    SchemaFormat,
} from './types';

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateOpenApiDocument(value: unknown): OpenApiDocument {
    if (!isObject(value)) {
        throw new Error('Schema must be an object.');
    }

    const hasVersion =
        typeof value.openapi === 'string' || typeof value.swagger === 'string';

    if (!hasVersion) {
        throw new Error('Schema must contain openapi or swagger version.');
    }

    if (!isObject(value.info)) {
        throw new Error('Schema must contain info object.');
    }

    if (!isObject(value.paths)) {
        throw new Error('Schema must contain paths object.');
    }

    return value as OpenApiDocument;
}

export function parseSchema(source: string): ParsedSchemaResult {
    const format = detectSchemaFormat(source);

    if (!format) {
        return {
            ok: false,
            error: 'Paste JSON or YAML OpenAPI schema.',
        };
    }

    try {
        const rawDocument =
            format === 'json' ? JSON.parse(source) : YAML.parse(source);

        const document = validateOpenApiDocument(rawDocument);

        return {
            ok: true,
            format,
            document,
        };
    } catch (error) {
        return {
            ok: false,
            format,
            error:
                error instanceof Error
                    ? error.message
                    : 'Unable to parse OpenAPI schema.',
        };
    }
}

export function convertSchemaFormat(
    source: string,
    targetFormat: SchemaFormat,
): string {
    const parsed = parseSchema(source);

    if (!parsed.ok) {
        throw new Error(parsed.error);
    }

    if (targetFormat === 'json') {
        return JSON.stringify(parsed.document, null, 4);
    }

    return YAML.stringify(parsed.document);
}
