'use client';

import Link from 'next/link';

import type { RequestHistoryEntry } from '@/lib/history/types';

type HistoryListProps = {
    items: RequestHistoryEntry[];
};

function formatTimestamp(value: string) {
    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

function formatBytes(value: number) {
    return `${value} B`;
}

export function HistoryList({ items }: HistoryListProps) {
    return (
        <div className="grid gap-4">
            {items.map((item) => (
                <article
                    key={item.id}
                    className="rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-5 shadow-[0_0_28px_rgba(34,211,238,0.1)] backdrop-blur-xl"
                >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="rounded-md bg-cyan-300 px-2 py-1 text-xs font-black uppercase text-slate-950">
                                    {item.method}
                                </span>
                                <p className="font-mono text-sm text-cyan-100">
                                    {item.url}
                                </p>
                            </div>
                            <div className="mt-4 grid gap-2 text-sm text-cyan-100/65 sm:grid-cols-2">
                                <p>
                                    Status:{' '}
                                    <span className="font-semibold text-cyan-100">
                                        {item.status ?? 'Failed'}
                                    </span>
                                </p>
                                <p>
                                    Duration:{' '}
                                    <span className="font-semibold text-cyan-100">
                                        {item.durationMs} ms
                                    </span>
                                </p>
                                <p>
                                    Request size:{' '}
                                    <span className="font-semibold text-cyan-100">
                                        {formatBytes(item.requestSize)}
                                    </span>
                                </p>
                                <p>
                                    Response size:{' '}
                                    <span className="font-semibold text-cyan-100">
                                        {formatBytes(item.responseSize)}
                                    </span>
                                </p>
                                <p className="sm:col-span-2">
                                    Timestamp:{' '}
                                    <span className="font-semibold text-cyan-100">
                                        {formatTimestamp(item.createdAt)}
                                    </span>
                                </p>
                                {item.errorDetails ? (
                                    <p className="sm:col-span-2 text-fuchsia-200/80">
                                        Error: {item.errorDetails}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <Link
                            href={`/history/${item.id}`}
                            className="shrink-0 rounded-md border border-fuchsia-300/40 bg-fuchsia-400/10 px-4 py-2 text-sm font-semibold text-fuchsia-200 shadow-[0_0_18px_rgba(217,70,239,0.15)] transition hover:border-fuchsia-300/70 hover:bg-fuchsia-400/20 hover:text-fuchsia-100"
                        >
                            View details
                        </Link>
                    </div>
                </article>
            ))}
        </div>
    );
}
