import { describe, expect, it } from 'vitest';

import { detectSchemaFormat } from './schema-format';

describe('detectSchemaFormat', () => {
    it('returns undefined for empty input', () => {
        expect(detectSchemaFormat('')).toBeUndefined();
        expect(detectSchemaFormat('   ')).toBeUndefined();
    });

    it('detects json', () => {
        expect(detectSchemaFormat('{"openapi":"3.0.0"}')).toBe('json');
    });

    it('falls back to yaml', () => {
        expect(detectSchemaFormat('openapi: 3.0.0')).toBe('yaml');
    });
});
