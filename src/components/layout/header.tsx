import Link from 'next/link';
import { cookies } from 'next/headers';
import { signOut } from '@/app/actions/auth';

export async function Header() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token');
    const isAuthenticated = Boolean(authToken);

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-lg font-bold text-slate-900">
                    Swagger Editor
                </Link>

                <nav className="flex items-center gap-4 text-sm font-medium">
                    <Link
                        href="/"
                        className="text-slate-700 hover:text-slate-950"
                    >
                        Editor
                    </Link>
                    <Link
                        href="/about"
                        className="text-slate-700 hover:text-slate-950"
                    >
                        About
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
                    >
                        EN
                    </button>

                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/history"
                                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-950"
                            >
                                History
                            </Link>
                            <form action={signOut}>
                                <button
                                    type="submit"
                                    className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                                >
                                    Sign Out
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/sign-in"
                                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-950"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/sign-up"
                                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
