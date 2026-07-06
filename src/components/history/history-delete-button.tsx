'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { deleteRequestHistoryItem } from '@/app/actions/request-history';

type HistoryDeleteButtonProps = {
    id: string;
    label?: string;
    redirectToHistory?: boolean;
    className?: string;
};

const deleteButtonClassName =
    'rounded-md border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:border-red-400/70 hover:bg-red-500/20 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-50';

export function HistoryDeleteButton({
    id,
    label = 'Delete',
    redirectToHistory = false,
    className,
}: HistoryDeleteButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        const confirmed = window.confirm(
            'Delete this request from your history?',
        );

        if (!confirmed) {
            return;
        }

        startTransition(async () => {
            const result = await deleteRequestHistoryItem(id);

            if (!result.ok) {
                window.alert(result.message ?? 'Failed to delete request.');
                return;
            }

            if (redirectToHistory) {
                router.push('/history');
            }

            router.refresh();
        });
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className={className ?? deleteButtonClassName}
        >
            {isPending ? 'Deleting...' : label}
        </button>
    );
}
