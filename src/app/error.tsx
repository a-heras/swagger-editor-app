'use client';

import Link from 'next/link';

import { useI18n } from '@/components/i18n/locale-provider';

const actionLinkClassName =
    'inline-flex rounded-md border border-fuchsia-300/40 bg-fuchsia-400/10 px-4 py-2 text-sm font-semibold text-fuchsia-200 transition hover:border-fuchsia-300/70 hover:bg-fuchsia-400/20 hover:text-fuchsia-100';

const retryButtonClassName =
    'inline-flex rounded-md border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/70 hover:bg-cyan-400/20 hover:text-cyan-100';

type ErrorPageProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    const { t } = useI18n();

    return (
        <section className="flex flex-1 items-center justify-center px-6 py-16">
            <div className="max-w-lg rounded-2xl border border-red-400/30 bg-slate-950/80 p-8 text-center shadow-[0_0_35px_rgba(248,113,113,0.12)] backdrop-blur-xl">
                <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-300">
                    {t('errors.applicationError')}
                </p>
                <h1 className="mt-4 text-3xl font-black text-red-100">
                    {t('errors.title')}
                </h1>
                <p className="mt-4 text-sm text-cyan-100/70">
                    {error.message || t('errors.description')}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={reset}
                        className={retryButtonClassName}
                    >
                        {t('errors.tryAgain')}
                    </button>
                    <Link href="/" className={actionLinkClassName}>
                        {t('errors.backHome')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
