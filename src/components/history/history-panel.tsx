'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { deleteRequestHistoryItems } from '@/app/actions/request-history';
import { useI18n } from '@/components/i18n/locale-provider';
import type { RequestHistoryPageResult } from '@/lib/history/types';
import { showError, showSuccess } from '@/lib/ui/toast';

import { HistoryEmptyState } from './history-empty-state';
import { HistoryList } from './history-list';
import { HistoryPagination } from './history-pagination';

type HistoryPanelProps = {
    historyPage: RequestHistoryPageResult;
};

const checkboxClassName =
    'h-4 w-4 rounded border border-cyan-300/40 bg-black/50 accent-fuchsia-400';

const selectButtonClassName =
    'rounded-md border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/70 hover:bg-cyan-400/20 hover:text-cyan-100';

const deleteButtonClassName =
    'rounded-md border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:border-red-400/70 hover:bg-red-500/20 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-50';

const cancelButtonClassName =
    'rounded-md border border-cyan-300/30 bg-black/30 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:text-cyan-100';

export default function HistoryPanel({ historyPage }: HistoryPanelProps) {
    const router = useRouter();
    const { t } = useI18n();
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleting, startDeleting] = useTransition();

    const pageItemIds = historyPage.items.map((item) => item.id);
    const allPageSelected =
        pageItemIds.length > 0 &&
        pageItemIds.every((id) => selectedIds.includes(id));
    const someSelected = selectedIds.length > 0;

    function handleToggle(id: string) {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((itemId) => itemId !== id)
                : [...current, id],
        );
    }

    function handleToggleAllOnPage() {
        if (allPageSelected) {
            setSelectedIds((current) =>
                current.filter((id) => !pageItemIds.includes(id)),
            );
            return;
        }

        setSelectedIds((current) => [...new Set([...current, ...pageItemIds])]);
    }

    function handleCancelSelection() {
        setSelectedIds([]);
        setIsSelectionMode(false);
    }

    function handleDeleteSelected() {
        if (!someSelected) {
            return;
        }

        const confirmed = window.confirm(
            t('history.deleteSelectedConfirm', { count: selectedIds.length }),
        );

        if (!confirmed) {
            return;
        }

        startDeleting(async () => {
            const result = await deleteRequestHistoryItems(selectedIds);

            if (!result.ok) {
                showError(result.message ?? t('history.deleteManyFailed'));
                return;
            }

            showSuccess(
                t('history.deletedMany', { count: selectedIds.length }),
            );

            setSelectedIds([]);
            setIsSelectionMode(false);
            router.refresh();
        });
    }

    if (historyPage.totalCount === 0) {
        return <HistoryEmptyState />;
    }

    return (
        <div className="flex flex-col gap-6">
            {isSelectionMode ? (
                <div className="flex w-full flex-wrap items-center gap-3 rounded-xl border border-cyan-300/15 bg-black/30 px-4 py-3">
                    <label className="mr-auto flex cursor-pointer items-center gap-3 text-sm font-semibold text-cyan-100/80">
                        <input
                            type="checkbox"
                            checked={allPageSelected}
                            onChange={handleToggleAllOnPage}
                            className={checkboxClassName}
                        />
                        {t('history.selectAll')}
                    </label>

                    <button
                        type="button"
                        onClick={handleCancelSelection}
                        disabled={isDeleting}
                        className={cancelButtonClassName}
                    >
                        {t('history.cancel')}
                    </button>

                    <button
                        type="button"
                        onClick={handleDeleteSelected}
                        disabled={!someSelected || isDeleting}
                        className={deleteButtonClassName}
                    >
                        {isDeleting
                            ? t('history.deleting')
                            : t('history.deleteSelected', {
                                  count: selectedIds.length,
                              })}
                    </button>
                </div>
            ) : (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setIsSelectionMode(true)}
                        className={selectButtonClassName}
                    >
                        {t('history.select')}
                    </button>
                </div>
            )}

            <HistoryList
                items={historyPage.items}
                selectionMode={isSelectionMode}
                selectedIds={selectedIds}
                onToggle={handleToggle}
            />

            <HistoryPagination
                page={historyPage.page}
                pageSize={historyPage.pageSize}
                totalPages={historyPage.totalPages}
                totalCount={historyPage.totalCount}
            />
        </div>
    );
}
