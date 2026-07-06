import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

import { signIn } from '@/app/actions/auth';
import { AuthForm } from '@/components/auth/auth-form';

type SignInPageProps = {
    searchParams?: Promise<{
        error?: string;
        message?: string;
    }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const params = await searchParams;

    if (user) {
        redirect('/');
    }

    return (
        <section className="flex flex-1 items-center justify-center px-6 py-10">
            <div className="w-full max-w-md">
                <AuthForm
                    title="Sign In"
                    description="Sign in to save schemas and access request history."
                    submitLabel="Sign In"
                    action={signIn}
                    errorMessage={params?.error}
                    infoMessage={params?.message}
                />

                <p className="mt-6 text-sm text-cyan-100/65">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/sign-up"
                        className="font-semibold text-cyan-300 hover:text-fuchsia-300"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </section>
    );
}
