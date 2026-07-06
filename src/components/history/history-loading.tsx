'use client';

import { useI18n } from '@/components/i18n/locale-provider';
import { PageLoader } from '@/components/ui/page-loader';

export function HistoryLoading() {
    const { t } = useI18n();

    return <PageLoader label={t('common.loading')} />;
}
