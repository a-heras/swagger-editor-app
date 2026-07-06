import { afterEach, describe, expect, it } from 'vitest';

import { getClientLocale } from './client-locale';

describe('getClientLocale', () => {
    afterEach(() => {
        document.cookie = 'locale=; Max-Age=0; path=/';
    });

    it('returns default locale without cookie', () => {
        expect(getClientLocale()).toBe('en');
    });

    it('reads locale from cookie', () => {
        document.cookie = 'locale=ru; path=/';

        expect(getClientLocale()).toBe('ru');
    });

    it('falls back for invalid cookie value', () => {
        document.cookie = 'locale=de; path=/';

        expect(getClientLocale()).toBe('en');
    });
});
