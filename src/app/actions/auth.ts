'use server';

import { redirect } from 'next/navigation';

import {
    hasAuthValidationErrors,
    validateAuthForm,
} from '@/lib/auth/validation';
import { createClient } from '@/lib/supabase/server';

function redirectWithMessage(
    path: '/sign-in' | '/sign-up',
    type: 'error' | 'message',
    message: string,
) {
    redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export async function signIn(formData: FormData) {
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const errors = validateAuthForm(email, password);

    if (hasAuthValidationErrors(errors)) {
        redirectWithMessage(
            '/sign-in',
            'error',
            'Check email and password requirements.',
        );
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        redirectWithMessage('/sign-in', 'error', error.message);
    }

    redirect('/');
}

export async function signUp(formData: FormData) {
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const errors = validateAuthForm(email, password);

    if (hasAuthValidationErrors(errors)) {
        redirectWithMessage(
            '/sign-up',
            'error',
            'Check email and password requirements.',
        );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        redirectWithMessage('/sign-up', 'error', error.message);
    }

    if (!data.session) {
        redirectWithMessage(
            '/sign-in',
            'message',
            'Check your email to confirm registration, then sign in.',
        );
    }

    redirect('/');
}

export async function signOut() {
    const supabase = await createClient();

    await supabase.auth.signOut();

    redirect('/');
}
