'use client';

import Link from 'next/link';

import { useI18n } from '@/components/i18n/locale-provider';

type HistoryPaginationProps = {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
};

const navButtonClassName =
    'rounded-md border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/50 hover:text-cyan-300';

const navButtonDisabledClassName =
    'cursor-not-allowed rounded-md border border-cyan-300/15 bg-black/20 px-4 py-2 text-sm font-semibold text-cyan-100/35';

const activePageClassName =
    'rounded-md border border-fuchsia-300/40 bg-fuchsia-400/10 px-3 py-2 text-sm font-bold text-fuchsia-200 shadow-[0_0_18px_rgba(217,70,239,0.15)]';

const pageLinkClassName =
    'rounded-md border border-cyan-300/20 bg-black/30 px-3 py-2 text-sm font-semibold text-cyan-100/80 transition hover:border-cyan-300/40 hover:text-cyan-200';

type PaginationNavButtonProps = {
    label: string;
    href?: string;
    disabled?: boolean;
};

function PaginationNavButton({
    label,
    href,
    disabled = false,
}: PaginationNavButtonProps) {
    if (disabled || !href) {
        return (
            <button
                type="button"
                disabled
                className={navButtonDisabledClassName}
            >
                {label}
            </button>
        );
    }

    return (
        <Link href={href} className={navButtonClassName}>
            {label}
        </Link>
    );
}

function getVisiblePages(page: number, totalPages: number) {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function HistoryPagination({
    page,
    pageSize,
    totalPages,
    totalCount,
}: HistoryPaginationProps) {
    const { t } = useI18n();

    if (totalPages <= 1) {
        return null;
    }

    const visiblePages = getVisiblePages(page, totalPages);
    const rangeStart = (page - 1) * pageSize + 1;
    const rangeEnd = Math.min(page * pageSize, totalCount);
    const isFirstDisabled = page <= 1;
    const isPreviousDisabled = page <= 1;
    const isNextDisabled = page >= totalPages;
    const isLastDisabled = page >= totalPages;

    return (
        <div className="flex flex-col items-center gap-4 border-t border-cyan-300/10 pt-6 text-center">
            <p className="text-sm text-cyan-100/60">
                {t('history.paginationShowing', {
                    start: rangeStart,
                    end: rangeEnd,
                    total: totalCount,
                })}
            </p>

            <nav
                className="flex flex-wrap items-center justify-center gap-2"
                aria-label={t('history.paginationLabel')}
            >
                <PaginationNavButton
                    label={t('history.first')}
                    href="/history?page=1"
                    disabled={isFirstDisabled}
                />
                <PaginationNavButton
                    label={t('history.previous')}
                    href={`/history?page=${page - 1}`}
                    disabled={isPreviousDisabled}
                />

                {visiblePages.map((pageNumber) =>
                    pageNumber === page ? (
                        <span
                            key={pageNumber}
                            className={activePageClassName}
                            aria-current="page"
                        >
                            {pageNumber}
                        </span>
                    ) : (
                        <Link
                            key={pageNumber}
                            href={`/history?page=${pageNumber}`}
                            className={pageLinkClassName}
                        >
                            {pageNumber}
                        </Link>
                    ),
                )}

                <PaginationNavButton
                    label={t('history.next')}
                    href={`/history?page=${page + 1}`}
                    disabled={isNextDisabled}
                />
                <PaginationNavButton
                    label={t('history.last')}
                    href={`/history?page=${totalPages}`}
                    disabled={isLastDisabled}
                />
            </nav>
        </div>
    );
}
