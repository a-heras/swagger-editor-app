import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import { loadRequestHistoryPage } from '@/app/actions/request-history';
import { HistoryLoading } from '@/components/history/history-loading';
import { createClient } from '@/lib/supabase/server';

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

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    const historyPage = await loadRequestHistoryPage(requestedPage);

    if (historyPage.totalPages > 0 && requestedPage > historyPage.totalPages) {
        redirect(`/history?page=${historyPage.totalPages}`);
    }

    return (
        <section className="flex flex-1">
            <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6 px-6 py-10">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
                        History & Analytics
                    </p>
                    <h1 className="mt-3 bg-gradient-to-r from-cyan-200 to-fuchsia-300 bg-clip-text text-4xl font-black text-transparent">
                        Request History
                    </h1>
                    <p className="mt-4 max-w-2xl text-cyan-100/70">
                        Review executed API requests, response statuses,
                        duration, and error details.
                    </p>
                </div>

                <HistoryPanel historyPage={historyPage} />
            </div>
        </section>
    );
}
