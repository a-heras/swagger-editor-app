export type AuthValidationErrors = {
    email?: string;
    password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const letterPattern = /\p{L}/u;
const digitPattern = /\p{N}/u;
const specialCharacterPattern = /[^\p{L}\p{N}\s]/u;

export function validateEmail(email: string): string | undefined {
    if (!email.trim()) {
        return 'auth.emailRequired';
    }

    if (!emailPattern.test(email)) {
        return 'auth.emailInvalid';
    }

    return undefined;
}

export function validatePassword(password: string): string | undefined {
    if (!password) {
        return 'auth.passwordRequired';
    }

    if (password.length < 8) {
        return 'auth.passwordMinLength';
    }

    if (!letterPattern.test(password)) {
        return 'auth.passwordLetter';
    }

    if (!digitPattern.test(password)) {
        return 'auth.passwordDigit';
    }

    if (!specialCharacterPattern.test(password)) {
        return 'auth.passwordSpecial';
    }

    return undefined;
}

export function validateAuthForm(
    email: string,
    password: string,
): AuthValidationErrors {
    return {
        email: validateEmail(email),
        password: validatePassword(password),
    };
}

export function hasAuthValidationErrors(errors: AuthValidationErrors): boolean {
    return Boolean(errors.email || errors.password);
}
