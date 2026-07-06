import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

import { signIn } from '@/app/actions/auth';
import { AuthForm } from '@/components/auth/auth-form';
import { getDictionary } from '@/i18n/get-dictionary';
import { getLocale } from '@/i18n/get-locale';
import { createTranslator } from '@/i18n/translate';

type SignInPageProps = {
    searchParams?: Promise<{
        error?: string;
        errorKey?: string;
        message?: string;
        messageKey?: string;
    }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const params = await searchParams;
    const locale = await getLocale();
    const dictionary = await getDictionary(locale);
    const t = createTranslator(dictionary);

    if (user) {
        redirect('/');
    }

    return (
        <section className="flex flex-1 items-center justify-center px-6 py-10">
            <div className="w-full max-w-md">
                <AuthForm
                    titleKey="auth.signInTitle"
                    descriptionKey="auth.signInDescription"
                    submitLabelKey="auth.signInTitle"
                    action={signIn}
                    errorMessage={params?.error}
                    errorKey={params?.errorKey}
                    infoMessage={params?.message}
                    infoKey={params?.messageKey}
                />

                <p className="mt-6 text-sm text-cyan-100/65">
                    {t('auth.noAccount')}{' '}
                    <Link
                        href="/sign-up"
                        className="font-semibold text-cyan-300 hover:text-fuchsia-300"
                    >
                        {t('auth.signUpTitle')}
                    </Link>
                </p>
            </div>
        </section>
    );
}
