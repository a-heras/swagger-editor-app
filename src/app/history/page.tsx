import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import { loadRequestHistoryPage } from '@/app/actions/request-history';
import { HistoryLoading } from '@/components/history/history-loading';
import { requireAuth } from '@/lib/auth/require-auth';
import { getDictionary } from '@/i18n/get-dictionary';
import { getLocale } from '@/i18n/get-locale';
import { createTranslator } from '@/i18n/translate';

const HistoryPanel = dynamic(
    () => import('@/components/history/history-panel'),
    {
        loading: () => <HistoryLoading />,
    },
);

type HistoryPageProps = {
    searchParams: Promise<{
        page?: string;
    }>;
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
    const { page: pageParam } = await searchParams;
    const requestedPage = Math.max(1, Number(pageParam) || 1);

    await requireAuth();

    const historyPage = await loadRequestHistoryPage(requestedPage);

    if (historyPage.totalPages > 0 && requestedPage > historyPage.totalPages) {
        redirect(`/history?page=${historyPage.totalPages}`);
    }

    const locale = await getLocale();
    const dictionary = await getDictionary(locale);
    const t = createTranslator(dictionary);

    return (
        <section className="flex flex-1">
            <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6 px-6 py-10">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
                        {t('history.eyebrow')}
                    </p>
                    <h1 className="mt-3 bg-gradient-to-r from-cyan-200 to-fuchsia-300 bg-clip-text text-4xl font-black text-transparent">
                        {t('history.title')}
                    </h1>
                    <p className="mt-4 max-w-2xl text-cyan-100/70">
                        {t('history.description')}
                    </p>
                </div>

                <HistoryPanel historyPage={historyPage} />
            </div>
        </section>
    );
}
