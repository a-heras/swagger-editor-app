'use server';

import { revalidatePath } from 'next/cache';

import type {
    RequestHistoryDetail,
    RequestHistoryEntry,
    RequestHistoryPageResult,
    SaveRequestHistoryInput,
} from '@/lib/history/types';
import { HISTORY_PAGE_SIZE } from '@/lib/history/constants';
import { createClient } from '@/lib/supabase/server';

type RequestHistoryRow = {
    id: string;
    method: string;
    url: string;
    status: number | null;
    duration_ms: number;
    request_size: number;
    response_size: number;
    error_details: string | null;
    created_at: string;
    request_headers: Record<string, string> | null;
    request_body: string | null;
    response_headers: Record<string, string> | null;
    response_body: string | null;
};

function mapHistoryEntry(row: RequestHistoryRow): RequestHistoryEntry {
    return {
        id: row.id,
        method: row.method,
        url: row.url,
        status: row.status,
        durationMs: row.duration_ms,
        requestSize: row.request_size,
        responseSize: row.response_size,
        errorDetails: row.error_details,
        createdAt: row.created_at,
    };
}

function mapHistoryDetail(row: RequestHistoryRow): RequestHistoryDetail {
    return {
        ...mapHistoryEntry(row),
        requestHeaders: row.request_headers,
        requestBody: row.request_body,
        responseHeaders: row.response_headers,
        responseBody: row.response_body,
    };
}

export async function saveRequestHistory(entry: SaveRequestHistoryInput) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { ok: false as const };
    }

    const { error } = await supabase.from('request_history').insert({
        user_id: user.id,
        method: entry.method,
        url: entry.url,
        status: entry.status,
        duration_ms: entry.durationMs,
        request_size: entry.requestSize,
        response_size: entry.responseSize,
        error_details: entry.errorDetails ?? null,
        request_headers: entry.requestHeaders ?? null,
        request_body: entry.requestBody ?? null,
        response_headers: entry.responseHeaders ?? null,
        response_body: entry.responseBody ?? null,
    });

    if (error) {
        return { ok: false as const, message: error.message };
    }

    revalidatePath('/history');

    return { ok: true as const };
}

export async function loadRequestHistoryPage(
    page = 1,
): Promise<RequestHistoryPageResult> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const emptyPage: RequestHistoryPageResult = {
        items: [],
        page: 1,
        pageSize: HISTORY_PAGE_SIZE,
        totalCount: 0,
        totalPages: 0,
    };

    if (!user) {
        return emptyPage;
    }

    const safePage = Math.max(1, page);

    const { count, error: countError } = await supabase
        .from('request_history')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

    if (countError) {
        console.error(
            'Failed to load request history count:',
            countError.message,
        );
        return emptyPage;
    }

    const totalCount = count ?? 0;
    const totalPages =
        totalCount === 0 ? 0 : Math.ceil(totalCount / HISTORY_PAGE_SIZE);

    if (totalPages === 0) {
        return emptyPage;
    }

    if (safePage > totalPages) {
        return {
            items: [],
            page: safePage,
            pageSize: HISTORY_PAGE_SIZE,
            totalCount,
            totalPages,
        };
    }

    const from = (safePage - 1) * HISTORY_PAGE_SIZE;
    const to = from + HISTORY_PAGE_SIZE - 1;

    const { data, error } = await supabase
        .from('request_history')
        .select(
            'id, method, url, status, duration_ms, request_size, response_size, error_details, created_at',
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error('Failed to load request history:', error.message);
        return {
            items: [],
            page: safePage,
            pageSize: HISTORY_PAGE_SIZE,
            totalCount,
            totalPages,
        };
    }

    return {
        items: (data ?? []).map((row) =>
            mapHistoryEntry(row as RequestHistoryRow),
        ),
        page: safePage,
        pageSize: HISTORY_PAGE_SIZE,
        totalCount,
        totalPages,
    };
}

export async function loadRequestHistory(): Promise<RequestHistoryEntry[]> {
    const historyPage = await loadRequestHistoryPage(1);
    return historyPage.items;
}

export async function loadRequestHistoryItem(
    id: string,
): Promise<RequestHistoryDetail | undefined> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return undefined;
    }

    const { data, error } = await supabase
        .from('request_history')
        .select(
            'id, method, url, status, duration_ms, request_size, response_size, error_details, created_at, request_headers, request_body, response_headers, response_body',
        )
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();

    if (error || !data) {
        return undefined;
    }

    return mapHistoryDetail(data as RequestHistoryRow);
}

export async function deleteRequestHistoryItem(id: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { ok: false as const, message: 'Sign in to delete history.' };
    }

    const { error } = await supabase
        .from('request_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        return { ok: false as const, message: error.message };
    }

    revalidatePath('/history');
    revalidatePath(`/history/${id}`);

    return { ok: true as const };
}

export async function deleteRequestHistoryItems(ids: string[]) {
    if (ids.length === 0) {
        return { ok: false as const, message: 'No requests selected.' };
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { ok: false as const, message: 'Sign in to delete history.' };
    }

    const { error } = await supabase
        .from('request_history')
        .delete()
        .in('id', ids)
        .eq('user_id', user.id);

    if (error) {
        return { ok: false as const, message: error.message };
    }

    revalidatePath('/history');
    ids.forEach((id) => revalidatePath(`/history/${id}`));

    return { ok: true as const, deletedCount: ids.length };
}
