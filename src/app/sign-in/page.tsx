import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { signIn } from '@/app/actions/auth';
import { AuthForm } from '@/components/auth/auth-form';

export default async function SignInPage() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token');

    if (authToken) {
        redirect('/');
    }

    return (
        <section className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-10">
            <div>
                <AuthForm
                    title="Sign In"
                    description="Sign in to save schemas and access request history."
                    submitLabel="Sign In"
                    action={signIn}
                />

                <p className="mt-6 text-sm text-slate-600">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/sign-up"
                        className="font-medium text-slate-950 hover:text-slate-600"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </section>
    );
}
