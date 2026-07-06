import { describe, expect, it } from 'vitest';

import {
    hasAuthValidationErrors,
    validateAuthForm,
    validateEmail,
    validatePassword,
} from './validation';

describe('validateEmail', () => {
    it('requires email', () => {
        expect(validateEmail('')).toBe('auth.emailRequired');
        expect(validateEmail('   ')).toBe('auth.emailRequired');
    });

    it('rejects invalid format', () => {
        expect(validateEmail('not-an-email')).toBe('auth.emailInvalid');
    });

    it('accepts valid email', () => {
        expect(validateEmail('user@example.com')).toBeUndefined();
    });
});

describe('validatePassword', () => {
    it('requires password', () => {
        expect(validatePassword('')).toBe('auth.passwordRequired');
    });

    it('enforces minimum length', () => {
        expect(validatePassword('Ab1!')).toBe('auth.passwordMinLength');
    });

    it('requires a letter', () => {
        expect(validatePassword('12345678!')).toBe('auth.passwordLetter');
    });

    it('requires a digit', () => {
        expect(validatePassword('Password!')).toBe('auth.passwordDigit');
    });

    it('requires a special character', () => {
        expect(validatePassword('Password1')).toBe('auth.passwordSpecial');
    });

    it('accepts unicode passwords', () => {
        expect(validatePassword('Пароль1!')).toBeUndefined();
    });
});

describe('validateAuthForm', () => {
    it('returns both field errors', () => {
        const errors = validateAuthForm('', '');

        expect(errors.email).toBe('auth.emailRequired');
        expect(errors.password).toBe('auth.passwordRequired');
        expect(hasAuthValidationErrors(errors)).toBe(true);
    });

    it('returns no errors for valid credentials', () => {
        const errors = validateAuthForm('user@example.com', 'Secure1!');

        expect(hasAuthValidationErrors(errors)).toBe(false);
    });
});
