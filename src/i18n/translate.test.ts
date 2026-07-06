import { describe, expect, it } from 'vitest';

import en from './locales/en.json';
import { createTranslator, translate } from './translate';

describe('translate', () => {
    it('resolves nested keys', () => {
        expect(translate(en, 'nav.editor')).toBe('Editor');
    });

    it('interpolates placeholders', () => {
        expect(
            translate(en, 'history.paginationShowing', {
                start: 1,
                end: 5,
                total: 10,
            }),
        ).toBe('Showing 1-5 of 10 requests');
    });

    it('returns the key for missing translations', () => {
        expect(translate(en, 'missing.key')).toBe('missing.key');
    });

    it('creates a translator helper', () => {
        const t = createTranslator(en);

        expect(t('auth.signInTitle')).toBe('Sign In');
    });
});
