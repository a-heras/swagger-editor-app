import Link from 'next/link';

export default function SignUpPage() {
    return (
        <section className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-10">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Authentication
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-950">
                        Sign Up
                    </h1>
                    <p className="mt-3 text-slate-600">
                        Create an account to save schemas and track API
                        requests.
                    </p>
                </div>

                <form className="mt-6 flex flex-col gap-4">
                    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                        Email
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                        Password
                        <input
                            type="password"
                            placeholder="At least 8 characters"
                            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
                        />
                    </label>

                    <button
                        type="submit"
                        className="mt-2 rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
                    >
                        Sign Up
                    </button>
                </form>

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
