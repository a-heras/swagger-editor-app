import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const historyItems: Array<{
    id: string;
    method: string;
    url: string;
    status: number;
    duration: number;
    timestamp: string;
}> = [];

export default async function HistoryPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }
    return (
        <section className="flex flex-1 bg-slate-50">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                        History & Analytics
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-950">
                        Request History
                    </h1>
                    <p className="mt-3 max-w-2xl text-slate-600">
                        Review executed API requests, response statuses,
                        duration, and error details.
                    </p>
                </div>

                {historyItems.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-950">
                            You haven&apos;t executed any requests yet
                        </h2>
                        <p className="mt-3 text-slate-600">
                            Load an OpenAPI schema and use Try It Out to send
                            your first request.
                        </p>
                        <div className="mt-6 flex justify-center gap-3">
                            <Link
                                href="/"
                                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                            >
                                Go to Editor
                            </Link>
                            <Link
                                href="/about"
                                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-950"
                            >
                                About Project
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {historyItems.map((item) => (
                            <article
                                key={item.id}
                                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500">
                                            {item.method}
                                        </p>
                                        <h2 className="mt-1 font-semibold text-slate-950">
                                            {item.url}
                                        </h2>
                                    </div>
                                    <div className="text-right text-sm text-slate-600">
                                        <p>Status: {item.status}</p>
                                        <p>Duration: {item.duration} ms</p>
                                        <p>{item.timestamp}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
