import type { SchemaFormat } from './types';

export function detectSchemaFormat(source: string): SchemaFormat | undefined {
    const content = source.trim();

    if (!content) {
        return undefined;
    }

    try {
        JSON.parse(content);
        return 'json';
    } catch {
        return 'yaml';
    }
}
