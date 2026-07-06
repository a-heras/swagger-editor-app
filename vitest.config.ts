import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['src/lib/**/*.ts', 'src/i18n/**/*.ts'],
            exclude: [
                '**/*.test.ts',
                'src/lib/supabase/**',
                'src/lib/auth/require-auth.ts',
                'src/lib/history/record-request.ts',
                'src/lib/history/types.ts',
                'src/lib/history/constants.ts',
                'src/lib/openapi/types.ts',
                'src/lib/ui/**',
                'src/i18n/types.ts',
                'src/i18n/get-locale.ts',
                'src/i18n/get-dictionary.ts',
            ],
            thresholds: {
                statements: 80,
                lines: 80,
                functions: 80,
            },
        },
    },
});
