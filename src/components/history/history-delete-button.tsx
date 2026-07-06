'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { deleteRequestHistoryItem } from '@/app/actions/request-history';
import { useI18n } from '@/components/i18n/locale-provider';
import { showError, showSuccess } from '@/lib/ui/toast';

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
    label,
    redirectToHistory = false,
    className,
}: HistoryDeleteButtonProps) {
    const router = useRouter();
    const { t } = useI18n();
    const [isPending, startTransition] = useTransition();
    const buttonLabel = label ?? t('history.delete');

    function handleDelete() {
        const confirmed = window.confirm(t('history.deleteConfirm'));

        if (!confirmed) {
            return;
        }

        startTransition(async () => {
            const result = await deleteRequestHistoryItem(id);

            if (!result.ok) {
                showError(result.message ?? t('history.deleteFailed'));
                return;
            }

            showSuccess(t('history.deletedOne'));

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
            {isPending ? t('history.deleting') : buttonLabel}
        </button>
    );
}
