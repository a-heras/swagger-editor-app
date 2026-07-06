import { describe, expect, it } from 'vitest';

import {
    buildErrorDetails,
    calculateRequestSize,
    calculateResponseSize,
} from './metrics';

describe('history metrics', () => {
    it('calculates request and response sizes', () => {
        const requestSize = calculateRequestSize({
            url: 'https://api.example.com/users',
            method: 'GET',
            headers: { Accept: 'application/json' },
            body: '',
        });

        expect(requestSize).toBeGreaterThan(0);
        expect(calculateResponseSize('{"ok":true}')).toBeGreaterThan(0);
        expect(calculateResponseSize()).toBe(0);
    });

    it('prefers proxy error details', () => {
        expect(
            buildErrorDetails({
                proxyError: 'Network failure',
                status: 500,
            }),
        ).toBe('Network failure');
    });

    it('builds HTTP error details from status and body', () => {
        expect(
            buildErrorDetails({
                status: 404,
                statusText: 'Not Found',
                responseBody: 'missing',
            }),
        ).toBe('404 Not Found: missing');
    });

    it('returns null for successful responses', () => {
        expect(
            buildErrorDetails({
                status: 200,
                statusText: 'OK',
            }),
        ).toBeNull();
    });
});
