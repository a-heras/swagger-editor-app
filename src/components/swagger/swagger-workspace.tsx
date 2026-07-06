'use client';

import { useMemo, useState } from 'react';

import { SchemaEditor } from './schema-editor';
import { SchemaViewer } from './schema-viewer';

import { extractEndpoints } from '@/lib/openapi/endpoints';
import { convertSchemaFormat, parseSchema } from '@/lib/openapi/schema-parser';
import type { SchemaFormat } from '@/lib/openapi/types';

const defaultSchema = `openapi: 3.0.0
info:
    title: Example API
    version: 1.0.0
paths:
    /users:
        get:
            summary: Get users
            responses:
                '200':
                    description: Successful response
`;

export function SwaggerWorkspace() {
    const [schemaSource, setSchemaSource] = useState(defaultSchema);

    const parsedSchema = useMemo(
        () => parseSchema(schemaSource),
        [schemaSource],
    );

    const endpoints = useMemo(() => {
        if (!parsedSchema.ok) {
            return [];
        }

        return extractEndpoints(parsedSchema.document);
    }, [parsedSchema]);

    const format = parsedSchema.ok ? parsedSchema.format : parsedSchema.format;
    const error = parsedSchema.ok ? undefined : parsedSchema.error;

    function handleToggleFormat() {
        if (!format) {
            return;
        }

        const targetFormat: SchemaFormat = format === 'json' ? 'yaml' : 'json';

        try {
            setSchemaSource(convertSchemaFormat(schemaSource, targetFormat));
        } catch {
            // The visible validation message already explains why conversion is unavailable.
        }
    }

    return (
        <div className="grid flex-1 gap-6 landscape:grid-cols-2 portrait:grid-cols-1">
            <SchemaEditor
                value={schemaSource}
                format={format}
                error={error}
                onChange={setSchemaSource}
                onToggleFormat={handleToggleFormat}
            />
            <SchemaViewer endpoints={endpoints} />
        </div>
    );
}
