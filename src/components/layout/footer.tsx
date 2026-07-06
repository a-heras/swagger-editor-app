'use client';

import Link from 'next/link';

import { useI18n } from '@/components/i18n/locale-provider';

export function Footer() {
    const { t } = useI18n();

    return (
        <footer className="border-t border-fuchsia-400/20 bg-slate-950/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-cyan-100/65 sm:flex-row sm:items-center sm:justify-between">
                <p>{t('footer.tagline')}</p>

                <nav className="flex items-center gap-4">
                    <Link href="/" className="transition hover:text-cyan-300">
                        {t('nav.editor')}
                    </Link>
                    <Link
                        href="/about"
                        className="transition hover:text-fuchsia-300"
                    >
                        {t('nav.about')}
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
