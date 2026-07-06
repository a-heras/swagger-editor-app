'use client';

import Link from 'next/link';

import type { RequestHistoryDetail } from '@/lib/history/types';

type HistoryDetailProps = {
    item: RequestHistoryDetail;
};

function formatTimestamp(value: string) {
    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'full',
        timeStyle: 'medium',
    }).format(new Date(value));
}

function formatBytes(value: number) {
    return `${value} B`;
}

function formatJsonBlock(value: string | null) {
    if (!value) {
        return '—';
    }

    try {
        return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
        return value;
    }
}

type DetailRowProps = {
    label: string;
    value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
    return (
        <div className="rounded-lg border border-cyan-300/10 bg-black/30 p-4 min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                {label}
            </p>
            <p className="mt-2 break-all font-mono text-sm text-cyan-100">
                {value}
            </p>
        </div>
    );
}

type CodeSectionProps = {
    label: string;
    value: string;
};

function CodeSection({ label, value }: CodeSectionProps) {
    return (
        <div className="min-w-0 max-w-full">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-200/80">
                {label}
            </p>
            <pre className="mt-2 max-h-96 w-full max-w-full overflow-auto whitespace-pre-wrap break-words rounded-lg border border-cyan-300/10 bg-black/50 p-3 font-mono text-xs leading-relaxed text-cyan-100/85">
                {value}
            </pre>
        </div>
    );
}

export function HistoryDetail({ item }: HistoryDetailProps) {
    return (
        <div className="flex min-w-0 flex-col gap-6">
            <Link
                href="/history"
                className="w-fit rounded-md border border-fuchsia-300/40 bg-fuchsia-400/10 px-4 py-2 text-sm font-semibold text-fuchsia-200 shadow-[0_0_18px_rgba(217,70,239,0.15)] transition hover:border-fuchsia-300/70 hover:bg-fuchsia-400/20 hover:text-fuchsia-100"
            >
                ← Back to history
            </Link>

            <article className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-6 shadow-[0_0_35px_rgba(34,211,238,0.12)] backdrop-blur-xl">
                <div className="flex min-w-0 flex-wrap items-center gap-3">
                    <span className="shrink-0 rounded-md bg-cyan-300 px-2 py-1 text-xs font-black uppercase text-slate-950">
                        {item.method}
                    </span>
                    <h2 className="min-w-0 break-all font-mono text-lg font-semibold text-cyan-100">
                        {item.url}
                    </h2>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <DetailRow
                        label="Response Status"
                        value={item.status?.toString() ?? 'Failed'}
                    />
                    <DetailRow
                        label="Duration"
                        value={`${item.durationMs} ms`}
                    />
                    <DetailRow
                        label="Timestamp"
                        value={formatTimestamp(item.createdAt)}
                    />
                    <DetailRow label="Method" value={item.method} />
                    <DetailRow
                        label="Request Size"
                        value={formatBytes(item.requestSize)}
                    />
                    <DetailRow
                        label="Response Size"
                        value={formatBytes(item.responseSize)}
                    />
                    <DetailRow label="Endpoint / URL" value={item.url} />
                    <DetailRow
                        label="Error Details"
                        value={item.errorDetails ?? 'None'}
                    />
                </div>

                <div className="mt-8 grid min-w-0 gap-6">
                    <CodeSection
                        label="Request Headers"
                        value={formatJsonBlock(
                            item.requestHeaders
                                ? JSON.stringify(item.requestHeaders)
                                : null,
                        )}
                    />
                    <CodeSection
                        label="Request Body"
                        value={formatJsonBlock(item.requestBody)}
                    />
                    <CodeSection
                        label="Response Headers"
                        value={formatJsonBlock(
                            item.responseHeaders
                                ? JSON.stringify(item.responseHeaders)
                                : null,
                        )}
                    />
                    <CodeSection
                        label="Response Body"
                        value={formatJsonBlock(item.responseBody)}
                    />
                </div>
            </article>
        </div>
    );
}
