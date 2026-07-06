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
        <section className="flex flex-1">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
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

                {historyItems.length === 0 ? (
                    <div className="rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-8 text-center shadow-[0_0_35px_rgba(34,211,238,0.12)] backdrop-blur-xl">
                        <h2 className="text-xl font-black text-cyan-100">
                            You haven&apos;t executed any requests yet
                        </h2>
                        <p className="mt-3 text-cyan-100/65">
                            Load an OpenAPI schema and use Try It Out to send
                            your first request.
                        </p>
                        <div className="mt-6 flex justify-center gap-3">
                            <Link
                                href="/"
                                className="rounded-md bg-gradient-to-r from-cyan-300 to-fuchsia-400 px-4 py-2 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                            >
                                Go to Editor
                            </Link>
                            <Link
                                href="/about"
                                className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 hover:text-cyan-300"
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
                                className="rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-5 shadow-[0_0_28px_rgba(34,211,238,0.1)] backdrop-blur-xl"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-bold text-fuchsia-300">
                                            {item.method}
                                        </p>
                                        <h2 className="mt-1 font-semibold text-cyan-100">
                                            {item.url}
                                        </h2>
                                    </div>
                                    <div className="text-right text-sm text-cyan-100/65">
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
