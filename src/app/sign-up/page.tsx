import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

import { signUp } from '@/app/actions/auth';
import { AuthForm } from '@/components/auth/auth-form';

type SignUpPageProps = {
    searchParams?: Promise<{
        error?: string;
        message?: string;
    }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
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
                    title="Sign Up"
                    description="Create an account to save schemas and track API requests."
                    submitLabel="Sign Up"
                    action={signUp}
                    errorMessage={params?.error}
                    infoMessage={params?.message}
                />

                <p className="mt-6 text-sm text-cyan-100/65">
                    Already have an account?{' '}
                    <Link
                        href="/sign-in"
                        className="font-semibold text-cyan-300 hover:text-fuchsia-300"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </section>
    );
}
