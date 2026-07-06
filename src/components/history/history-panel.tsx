'use client';

import type { RequestHistoryEntry } from '@/lib/history/types';

import { HistoryEmptyState } from './history-empty-state';
import { HistoryList } from './history-list';

type HistoryPanelProps = {
    items: RequestHistoryEntry[];
};

export default function HistoryPanel({ items }: HistoryPanelProps) {
    if (items.length === 0) {
        return <HistoryEmptyState />;
    }

    return <HistoryList items={items} />;
}
