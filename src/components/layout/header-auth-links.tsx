'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { signOut } from '@/app/actions/auth';

type HeaderAuthLinksProps = {
    isAuthenticated: boolean;
};

const inactiveLinkClassName =
    'cursor-pointer rounded-md px-3 py-2 text-sm font-semibold text-cyan-100/80 transition hover:text-cyan-300';
const activeLinkClassName =
    'rounded-md bg-gradient-to-r from-cyan-300 to-fuchsia-400 px-3 py-2 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)]';
const primaryLinkClassName =
    'rounded-md bg-gradient-to-r from-cyan-300 to-fuchsia-400 px-3 py-2 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)] transition hover:scale-105';
const activePrimaryLinkClassName = activeLinkClassName;

export function HeaderAuthLinks({ isAuthenticated }: HeaderAuthLinksProps) {
    const pathname = usePathname();

    if (isAuthenticated) {
        const isHistoryActive = pathname.startsWith('/history');

        return (
            <>
                <Link
                    href="/history"
                    aria-current={isHistoryActive ? 'page' : undefined}
                    className={
                        isHistoryActive
                            ? activeLinkClassName
                            : inactiveLinkClassName
                    }
                >
                    History
                </Link>
                <form action={signOut}>
                    <button type="submit" className={inactiveLinkClassName}>
                        Sign Out
                    </button>
                </form>
            </>
        );
    }

    const isSignInActive = pathname.startsWith('/sign-in');
    const isSignUpActive = pathname.startsWith('/sign-up');
    const signUpClassName = isSignUpActive
        ? activePrimaryLinkClassName
        : isSignInActive
          ? inactiveLinkClassName
          : primaryLinkClassName;

    return (
        <>
            <Link
                href="/sign-in"
                aria-current={isSignInActive ? 'page' : undefined}
                className={
                    isSignInActive ? activeLinkClassName : inactiveLinkClassName
                }
            >
                Sign In
            </Link>
            <Link
                href="/sign-up"
                aria-current={isSignUpActive ? 'page' : undefined}
                className={signUpClassName}
            >
                Sign Up
            </Link>
        </>
    );
}
