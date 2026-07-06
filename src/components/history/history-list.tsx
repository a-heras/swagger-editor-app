'use client';

import Link from 'next/link';

import type { RequestHistoryEntry } from '@/lib/history/types';

import { HistoryDeleteButton } from './history-delete-button';

type HistoryListProps = {
    items: RequestHistoryEntry[];
    selectionMode: boolean;
    selectedIds: string[];
    onToggle: (id: string) => void;
};

const checkboxClassName =
    'mt-1 h-4 w-4 shrink-0 rounded border border-cyan-300/40 bg-black/50 accent-fuchsia-400';

const actionLinkClassName =
    'shrink-0 rounded-md border border-fuchsia-300/40 bg-fuchsia-400/10 px-4 py-2 text-sm font-semibold text-fuchsia-200 shadow-[0_0_18px_rgba(217,70,239,0.15)] transition hover:border-fuchsia-300/70 hover:bg-fuchsia-400/20 hover:text-fuchsia-100';

function formatTimestamp(value: string) {
    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

function formatBytes(value: number) {
    return `${value} B`;
}

export function HistoryList({
    items,
    selectionMode,
    selectedIds,
    onToggle,
}: HistoryListProps) {
    return (
        <div className="grid gap-4">
            {items.map((item) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                    <article
                        key={item.id}
                        role={selectionMode ? 'button' : undefined}
                        tabIndex={selectionMode ? 0 : undefined}
                        aria-pressed={selectionMode ? isSelected : undefined}
                        onClick={
                            selectionMode ? () => onToggle(item.id) : undefined
                        }
                        onKeyDown={
                            selectionMode
                                ? (event) => {
                                      if (
                                          event.key === 'Enter' ||
                                          event.key === ' '
                                      ) {
                                          event.preventDefault();
                                          onToggle(item.id);
                                      }
                                  }
                                : undefined
                        }
                        className={`rounded-2xl border bg-slate-950/70 p-5 shadow-[0_0_28px_rgba(34,211,238,0.1)] backdrop-blur-xl ${
                            isSelected
                                ? 'border-fuchsia-300/50 shadow-[0_0_28px_rgba(217,70,239,0.12)]'
                                : 'border-cyan-300/20'
                        } ${selectionMode ? 'cursor-pointer transition hover:border-fuchsia-300/35' : ''}`}
                    >
                        <div className="flex flex-wrap items-start gap-4">
                            {selectionMode ? (
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => onToggle(item.id)}
                                    onClick={(event) => event.stopPropagation()}
                                    aria-label={`Select request ${item.method} ${item.url}`}
                                    className={checkboxClassName}
                                />
                            ) : null}

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

                            {selectionMode ? null : (
                                <div className="flex shrink-0 flex-col gap-2">
                                    <Link
                                        href={`/history/${item.id}`}
                                        className={actionLinkClassName}
                                    >
                                        View details
                                    </Link>
                                    <HistoryDeleteButton id={item.id} />
                                </div>
                            )}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
