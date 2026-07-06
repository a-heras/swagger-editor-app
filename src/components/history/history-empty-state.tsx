'use client';

import Link from 'next/link';

import { useI18n } from '@/components/i18n/locale-provider';

export function HistoryEmptyState() {
    const { t } = useI18n();

    return (
        <div className="rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-8 text-center shadow-[0_0_35px_rgba(34,211,238,0.12)] backdrop-blur-xl">
            <h2 className="text-xl font-black text-cyan-100">
                {t('history.emptyTitle')}
            </h2>
            <p className="mt-3 text-cyan-100/65">
                {t('history.emptyDescription')}
            </p>
            <div className="mt-6 flex justify-center gap-3">
                <Link
                    href="/"
                    className="rounded-md bg-gradient-to-r from-cyan-300 to-fuchsia-400 px-4 py-2 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                >
                    {t('history.goToEditor')}
                </Link>
                <Link
                    href="/"
                    className="rounded-md border border-fuchsia-300/30 bg-fuchsia-400/10 px-4 py-2 text-sm font-semibold text-fuchsia-100 hover:text-fuchsia-200"
                >
                    {t('history.goToViewer')}
                </Link>
            </div>
        </div>
    );
}
