export type RequestHistoryEntry = {
    id: string;
    method: string;
    url: string;
    status: number | null;
    durationMs: number;
    requestSize: number;
    responseSize: number;
    errorDetails: string | null;
    createdAt: string;
};

export type RequestHistoryDetail = RequestHistoryEntry & {
    requestHeaders: Record<string, string> | null;
    requestBody: string | null;
    responseHeaders: Record<string, string> | null;
    responseBody: string | null;
};

export type SaveRequestHistoryInput = {
    method: string;
    url: string;
    status: number | null;
    durationMs: number;
    requestSize: number;
    responseSize: number;
    errorDetails?: string | null;
    requestHeaders?: Record<string, string>;
    requestBody?: string;
    responseHeaders?: Record<string, string>;
    responseBody?: string;
};

export type RequestHistoryPageResult = {
    items: RequestHistoryEntry[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
};
