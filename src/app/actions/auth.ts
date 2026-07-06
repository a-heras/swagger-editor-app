'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
    hasAuthValidationErrors,
    validateAuthForm,
} from '@/lib/auth/validation';

const authTokenName = 'auth-token';

function createMockAuthToken() {
    return `mock-token-${Date.now()}`;
}

async function setAuthToken() {
    const cookieStore = await cookies();

    cookieStore.set(authTokenName, createMockAuthToken(), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60,
    });
}

export async function signIn(formData: FormData) {
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const errors = validateAuthForm(email, password);

    if (hasAuthValidationErrors(errors)) {
        redirect('/sign-in');
    }

    await setAuthToken();

    redirect('/');
}

export async function signUp(formData: FormData) {
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const errors = validateAuthForm(email, password);

    if (hasAuthValidationErrors(errors)) {
        redirect('/sign-up');
    }

    await setAuthToken();

    redirect('/');
}

export async function signOut() {
    const cookieStore = await cookies();

    cookieStore.delete(authTokenName);

    redirect('/');
}
