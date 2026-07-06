import { describe, expect, it } from 'vitest';

import { DEFAULT_LOCALE, isLocale, LOCALES } from './config';

describe('i18n config', () => {
    it('supports en and ru locales', () => {
        expect(LOCALES).toEqual(['en', 'ru']);
        expect(isLocale('en')).toBe(true);
        expect(isLocale('ru')).toBe(true);
        expect(isLocale('de')).toBe(false);
        expect(DEFAULT_LOCALE).toBe('en');
    });
});
