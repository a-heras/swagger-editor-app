import { describe, expect, it } from 'vitest';

import { generateCurlCommand } from './curl';

describe('generateCurlCommand', () => {
    it('builds a curl command with headers', () => {
        const command = generateCurlCommand({
            url: 'https://api.example.com/users',
            method: 'get',
            headers: { Accept: 'application/json' },
        });

        expect(command).toContain(
            "curl -X GET 'https://api.example.com/users'",
        );
        expect(command).toContain('Accept: application/json');
    });

    it('escapes quotes and includes body for POST', () => {
        const command = generateCurlCommand({
            url: 'https://api.example.com/users',
            method: 'post',
            headers: { 'X-Name': "O'Brien" },
            body: '{"name":"O\'Brien"}',
        });

        expect(command).toContain('-d ');
        expect(command).toContain("O'\\''Brien");
    });

    it('omits body for GET requests', () => {
        const command = generateCurlCommand({
            url: 'https://api.example.com/users',
            method: 'get',
            headers: {},
            body: '{"ignored":true}',
        });

        expect(command).not.toContain('-d ');
    });
});
