import { describe, expect, it } from 'vitest';

import {
    buildRequestHeaders,
    buildRequestUrl,
    methodSupportsBody,
} from './build-request';
import type { ApiEndpoint } from './types';

const endpoint: ApiEndpoint = {
    id: 'get-/users/{id}',
    path: '/users/{id}',
    method: 'get',
    parameters: [],
    responses: {},
};

describe('buildRequestUrl', () => {
    it('replaces path params and appends query params', () => {
        const url = buildRequestUrl(
            'https://api.example.com',
            endpoint,
            { id: '42' },
            { include: 'posts', empty: '' },
        );

        expect(url).toBe('https://api.example.com/users/42?include=posts');
    });

    it('throws for invalid base url', () => {
        expect(() =>
            buildRequestUrl('::::', endpoint, { id: '1' }, {}),
        ).toThrow('Invalid base URL or request path');
    });
});

describe('buildRequestHeaders', () => {
    it('builds headers, cookies and content type', () => {
        expect(
            buildRequestHeaders(
                { 'X-Test': '1', Empty: '' },
                { session: 'abc' },
                'application/json',
            ),
        ).toEqual({
            'X-Test': '1',
            Cookie: 'session=abc',
            'Content-Type': 'application/json',
        });
    });
});

describe('methodSupportsBody', () => {
    it('returns false for GET and HEAD', () => {
        expect(methodSupportsBody('GET')).toBe(false);
        expect(methodSupportsBody('head')).toBe(false);
        expect(methodSupportsBody('POST')).toBe(true);
    });
});
