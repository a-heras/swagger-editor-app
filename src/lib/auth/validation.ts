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
        return 'Email is required.';
    }

    if (!emailPattern.test(email)) {
        return 'Enter a valid email address.';
    }

    return undefined;
}

export function validatePassword(password: string): string | undefined {
    if (!password) {
        return 'Password is required.';
    }

    if (password.length < 8) {
        return 'Password must contain at least 8 characters.';
    }

    if (!letterPattern.test(password)) {
        return 'Password must contain at least one letter.';
    }

    if (!digitPattern.test(password)) {
        return 'Password must contain at least one digit.';
    }

    if (!specialCharacterPattern.test(password)) {
        return 'Password must contain at least one special character.';
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
