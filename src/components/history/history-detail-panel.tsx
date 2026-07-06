'use client';

import type { RequestHistoryDetail } from '@/lib/history/types';

import { HistoryDetail } from './history-detail';

type HistoryDetailPanelProps = {
    item: RequestHistoryDetail;
};

export default function HistoryDetailPanel({ item }: HistoryDetailPanelProps) {
    return <HistoryDetail item={item} />;
}
