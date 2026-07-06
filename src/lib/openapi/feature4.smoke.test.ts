import { describe, expect, it } from 'vitest';

import { buildRequestHeaders, buildRequestUrl } from './build-request';
import { generateCurlCommand } from './curl';
import { extractEndpoints, getBaseUrl } from './endpoints';
import {
    groupEndpointsByPath,
    groupParametersByLocation,
} from './schema-display';
import { parseSchema } from './schema-parser';

const testSchema = `openapi: 3.0.0
info:
    title: Full Test API
    version: 1.0.0
servers:
    - url: https://jsonplaceholder.typicode.com
paths:
    /users:
        get:
            summary: List all users
            parameters:
                - name: X-Request-Id
                  in: header
                  schema:
                      type: string
                - name: session
                  in: cookie
                  schema:
                      type: string
            responses:
                '200':
                    description: OK
                    content:
                        application/json:
                            schema:
                                type: array
                                items:
                                    type: object
                            example:
                                - id: 1
                                  name: John
                '500':
                    description: Server error
        post:
            summary: Create user
            requestBody:
                required: true
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                name:
                                    type: string
            responses:
                '201':
                    description: Created
                '400':
                    description: Bad request
    /users/{id}:
        get:
            summary: Get user by id
            parameters:
                - name: id
                  in: path
                  required: true
                  schema:
                      type: integer
                - name: include
                  in: query
                  schema:
                      type: string
            responses:
                '200':
                    description: OK
                '404':
                    description: Not found
`;

describe('Feature 4 smoke', () => {
    it('parses the full test schema', () => {
        const parsed = parseSchema(testSchema);

        expect(parsed.ok).toBe(true);
        if (!parsed.ok) {
            return;
        }

        expect(getBaseUrl(parsed.document)).toBe(
            'https://jsonplaceholder.typicode.com',
        );
    });

    it('extracts and groups endpoints by path and method', () => {
        const parsed = parseSchema(testSchema);
        expect(parsed.ok).toBe(true);
        if (!parsed.ok) {
            return;
        }

        const endpoints = extractEndpoints(parsed.document);
        expect(endpoints).toHaveLength(3);

        const grouped = groupEndpointsByPath(endpoints);
        expect(grouped).toHaveLength(2);
        expect(grouped[0]?.[0]).toBe('/users');
        expect(grouped[0]?.[1].map((endpoint) => endpoint.method)).toEqual([
            'get',
            'post',
        ]);
        expect(grouped[1]?.[0]).toBe('/users/{id}');
    });

    it('groups all parameter locations on GET /users/{id}', () => {
        const parsed = parseSchema(testSchema);
        expect(parsed.ok).toBe(true);
        if (!parsed.ok) {
            return;
        }

        const endpoint = extractEndpoints(parsed.document).find(
            (item) => item.path === '/users/{id}',
        );
        expect(endpoint).toBeDefined();

        const grouped = groupParametersByLocation(endpoint!.parameters);
        expect(grouped.path).toHaveLength(1);
        expect(grouped.query).toHaveLength(1);
    });

    it('builds request url and curl command', () => {
        const parsed = parseSchema(testSchema);
        expect(parsed.ok).toBe(true);
        if (!parsed.ok) {
            return;
        }

        const endpoint = extractEndpoints(parsed.document).find(
            (item) => item.path === '/users/{id}',
        );
        expect(endpoint).toBeDefined();

        const url = buildRequestUrl(
            getBaseUrl(parsed.document),
            endpoint!,
            { id: '5' },
            { include: 'posts' },
        );
        expect(url).toBe(
            'https://jsonplaceholder.typicode.com/users/5?include=posts',
        );

        const headers = buildRequestHeaders(
            { 'X-Request-Id': 'test' },
            { session: 'abc' },
        );
        const curl = generateCurlCommand({
            url,
            method: 'get',
            headers,
        });

        expect(curl).toContain(
            "curl -X GET 'https://jsonplaceholder.typicode.com/users/5?include=posts'",
        );
        expect(curl).toContain('X-Request-Id: test');
    });
});
