import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';

import { loadRequestHistoryItem } from '@/app/actions/request-history';
import { HistoryLoading } from '@/components/history/history-loading';
import { createClient } from '@/lib/supabase/server';

const HistoryDetailPanel = dynamic(
    () => import('@/components/history/history-detail-panel'),
    {
        loading: () => <HistoryLoading />,
    },
);

type HistoryDetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function HistoryDetailPage({
    params,
}: HistoryDetailPageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    const item = await loadRequestHistoryItem(id);

    if (!item) {
        notFound();
    }

    return (
        <section className="flex flex-1">
            <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6 px-6 py-10">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
                        History & Analytics
                    </p>
                    <h1 className="mt-3 bg-gradient-to-r from-cyan-200 to-fuchsia-300 bg-clip-text text-4xl font-black text-transparent">
                        Request Analytics
                    </h1>
                    <p className="mt-4 max-w-2xl text-cyan-100/70">
                        Detailed metrics and payloads for a single executed
                        request.
                    </p>
                </div>

                <HistoryDetailPanel item={item} />
            </div>
        </section>
    );
}
