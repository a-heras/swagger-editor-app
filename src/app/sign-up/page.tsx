import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { signUp } from '@/app/actions/auth';
import { AuthForm } from '@/components/auth/auth-form';

export default async function SignUpPage() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token');

    if (authToken) {
        redirect('/');
    }

    return (
        <section className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-10">
            <div>
                <AuthForm
                    title="Sign Up"
                    description="Create an account to save schemas and track API requests."
                    submitLabel="Sign Up"
                    action={signUp}
                />

                <p className="mt-6 text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link
                        href="/sign-in"
                        className="font-medium text-slate-950 hover:text-slate-600"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </section>
    );
}
