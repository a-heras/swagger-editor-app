'use client';

import { useMemo } from 'react';

import { getClientLocale } from '@/i18n/client-locale';
import { createTranslator } from '@/i18n/translate';
import en from '@/i18n/locales/en.json';
import ru from '@/i18n/locales/ru.json';

type GlobalErrorPageProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function GlobalErrorPage({
    error,
    reset,
}: GlobalErrorPageProps) {
    const t = useMemo(() => {
        const locale = getClientLocale();
        const dictionary = locale === 'ru' ? ru : en;

        return createTranslator(dictionary);
    }, []);

    return (
        <html lang={getClientLocale()}>
            <body className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-cyan-100">
                <div className="max-w-lg rounded-2xl border border-red-400/30 bg-slate-950/90 p-8 text-center shadow-[0_0_35px_rgba(248,113,113,0.12)]">
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-300">
                        {t('errors.applicationError')}
                    </p>
                    <h1 className="mt-4 text-3xl font-black text-red-100">
                        {t('errors.criticalTitle')}
                    </h1>
                    <p className="mt-4 text-sm text-cyan-100/70">
                        {error.message || t('errors.criticalDescription')}
                    </p>
                    <button
                        type="button"
                        onClick={reset}
                        className="mt-8 rounded-md border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/70 hover:bg-cyan-400/20"
                    >
                        {t('errors.tryAgain')}
                    </button>
                </div>
            </body>
        </html>
    );
}
