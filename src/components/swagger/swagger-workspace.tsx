'use client';

import { useTransition } from 'react';
import { useMemo, useState } from 'react';

import { saveSchema } from '@/app/actions/schema';
import { useI18n } from '@/components/i18n/locale-provider';
import { showError, showSuccess } from '@/lib/ui/toast';
import { SchemaEditor } from './schema-editor';
import { SchemaViewer } from './schema-viewer';

import { extractEndpoints, getBaseUrl } from '@/lib/openapi/endpoints';
import { convertSchemaFormat, parseSchema } from '@/lib/openapi/schema-parser';
import type { SchemaFormat } from '@/lib/openapi/types';

const defaultSchema = `openapi: 3.0.0
info:
    title: Example API
    version: 1.0.0
servers:
    - url: https://jsonplaceholder.typicode.com
paths:
    /users:
        get:
            summary: Get users
            responses:
                '200':
                    description: Successful response
`;

type SwaggerWorkspaceProps = {
    initialSchema?: string;
};

export function SwaggerWorkspace({ initialSchema }: SwaggerWorkspaceProps) {
    const { t } = useI18n();
    const [schemaSource, setSchemaSource] = useState(
        initialSchema ?? defaultSchema,
    );
    const [saveMessage, setSaveMessage] = useState<string>();
    const [isSaving, startSaving] = useTransition();

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
    const baseUrl = parsedSchema.ok ? getBaseUrl(parsedSchema.document) : '';

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

    function handleSaveSchema() {
        startSaving(async () => {
            const result = await saveSchema(schemaSource);
            const message =
                'messageKey' in result && result.messageKey
                    ? t(result.messageKey)
                    : (result.message ?? t('errors.title'));

            setSaveMessage(message);

            if (result.ok) {
                showSuccess(message);
                return;
            }

            showError(message);
        });
    }

    return (
        <div className="grid flex-1 gap-6 landscape:grid-cols-2 portrait:grid-cols-1">
            <SchemaEditor
                value={schemaSource}
                format={format}
                error={error}
                saveMessage={saveMessage}
                isSaving={isSaving}
                onChange={setSchemaSource}
                onToggleFormat={handleToggleFormat}
                onSave={handleSaveSchema}
            />
            <SchemaViewer endpoints={endpoints} baseUrl={baseUrl} />
        </div>
    );
}
