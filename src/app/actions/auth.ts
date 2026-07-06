'use server';

import { redirect } from 'next/navigation';

import {
    hasAuthValidationErrors,
    validateAuthForm,
} from '@/lib/auth/validation';
import { createClient } from '@/lib/supabase/server';

function redirectWithKey(
    path: '/sign-in' | '/sign-up',
    type: 'errorKey' | 'messageKey',
    key: string,
) {
    redirect(`${path}?${type}=${encodeURIComponent(key)}`);
}

export async function signIn(formData: FormData) {
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const errors = validateAuthForm(email, password);

    if (hasAuthValidationErrors(errors)) {
        redirectWithKey('/sign-in', 'errorKey', 'auth.validationFailed');
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
    }

    redirect('/?successKey=auth.signedIn');
}

export async function signUp(formData: FormData) {
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const errors = validateAuthForm(email, password);

    if (hasAuthValidationErrors(errors)) {
        redirectWithKey('/sign-up', 'errorKey', 'auth.validationFailed');
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        redirect(`/sign-up?error=${encodeURIComponent(error.message)}`);
    }

    if (!data.session) {
        redirectWithKey('/sign-in', 'messageKey', 'auth.confirmEmail');
    }

    redirect('/?successKey=auth.accountCreated');
}

export async function signOut() {
    const supabase = await createClient();

    await supabase.auth.signOut();

    redirect('/');
}
