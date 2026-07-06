'use client';

import {
    useMemo,
    useState,
    useTransition,
    type Dispatch,
    type SetStateAction,
} from 'react';

import type { ApiEndpoint, OpenApiParameter } from '@/lib/openapi/types';
import {
    buildRequestHeaders,
    buildRequestUrl,
    methodSupportsBody,
} from '@/lib/openapi/build-request';
import { generateCurlCommand } from '@/lib/openapi/curl';
import {
    formatExample,
    getMediaTypeExample,
    groupParametersByLocation,
} from '@/lib/openapi/schema-display';
import { showError } from '@/lib/ui/toast';
import { useI18n } from '@/components/i18n/locale-provider';

type TryItOutProps = {
    endpoint: ApiEndpoint;
    baseUrl: string;
};

type ProxySuccess = {
    ok: boolean;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
    durationMs: number;
};

type ProxyFailure = {
    error: string;
    durationMs?: number;
};

const inputClassName =
    'rounded-md border border-cyan-300/20 bg-black/45 px-3 py-2 font-mono text-sm text-cyan-50 outline-none transition placeholder:text-cyan-100/30 focus:border-cyan-300/70';

function buildParamDefaults(parameters: OpenApiParameter[]) {
    return Object.fromEntries(
        parameters
            .filter((parameter) => parameter.name)
            .map((parameter) => [
                parameter.name as string,
                parameter.example !== undefined
                    ? String(parameter.example)
                    : parameter.schema?.default !== undefined
                      ? String(parameter.schema.default)
                      : '',
            ]),
    );
}

function formatResponseBody(body: string) {
    try {
        return JSON.stringify(JSON.parse(body), null, 2);
    } catch {
        return body;
    }
}

type ParameterInputsProps = {
    title: string;
    requiredLabel: string;
    parameters: OpenApiParameter[];
    values: Record<string, string>;
    onChange: (name: string, value: string) => void;
};

function ParameterInputs({
    title,
    requiredLabel,
    parameters,
    values,
    onChange,
}: ParameterInputsProps) {
    if (parameters.length === 0) {
        return null;
    }

    return (
        <div>
            <h5 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                {title}
            </h5>
            <div className="mt-2 flex flex-col gap-3">
                {parameters.map((parameter) => {
                    const name = parameter.name ?? 'unnamed';

                    return (
                        <label
                            key={`${parameter.in}-${name}`}
                            className="flex flex-col gap-2 text-sm font-semibold text-cyan-100/80"
                        >
                            {name}
                            {parameter.required ? (
                                <span className="text-[10px] font-bold uppercase text-fuchsia-200">
                                    {requiredLabel}
                                </span>
                            ) : null}
                            <input
                                value={values[name] ?? ''}
                                onChange={(event) =>
                                    onChange(name, event.target.value)
                                }
                                className={inputClassName}
                                placeholder={parameter.description ?? name}
                            />
                        </label>
                    );
                })}
            </div>
        </div>
    );
}

export function TryItOut({ endpoint, baseUrl }: TryItOutProps) {
    const { t } = useI18n();
    const groupedParameters = useMemo(
        () => groupParametersByLocation(endpoint.parameters),
        [endpoint.parameters],
    );

    const contentTypes = Object.keys(endpoint.requestBody?.content ?? {});
    const defaultContentType = contentTypes[0] ?? 'application/json';
    const defaultMediaType =
        endpoint.requestBody?.content?.[defaultContentType];

    const [pathParams, setPathParams] = useState(() =>
        buildParamDefaults(groupedParameters.path),
    );
    const [queryParams, setQueryParams] = useState(() =>
        buildParamDefaults(groupedParameters.query),
    );
    const [headerParams, setHeaderParams] = useState(() =>
        buildParamDefaults(groupedParameters.header),
    );
    const [cookieParams, setCookieParams] = useState(() =>
        buildParamDefaults(groupedParameters.cookie),
    );
    const [contentType, setContentType] = useState(defaultContentType);
    const [body, setBody] = useState(() =>
        formatExample(getMediaTypeExample(defaultMediaType)),
    );
    const [curlCommand, setCurlCommand] = useState('');
    const [copied, setCopied] = useState(false);
    const [customBaseUrl, setCustomBaseUrl] = useState('');
    const [response, setResponse] = useState<ProxySuccess>();
    const [isExecuting, startExecuting] = useTransition();

    const effectiveBaseUrl = (baseUrl || customBaseUrl).trim();

    function reportError(message: string) {
        showError(message);
    }

    const hasRequestBody =
        Boolean(endpoint.requestBody) && methodSupportsBody(endpoint.method);

    function updateParam(
        setter: Dispatch<SetStateAction<Record<string, string>>>,
        name: string,
        value: string,
    ) {
        setter((current) => ({ ...current, [name]: value }));
    }

    function getRequestConfig() {
        const url = buildRequestUrl(
            effectiveBaseUrl,
            endpoint,
            pathParams,
            queryParams,
        );
        const headers = buildRequestHeaders(
            headerParams,
            cookieParams,
            hasRequestBody ? contentType : undefined,
        );

        return {
            url,
            method: endpoint.method.toUpperCase(),
            headers,
            body: hasRequestBody ? body : undefined,
        };
    }

    function handleGenerateCurl() {
        if (!effectiveBaseUrl) {
            reportError(t('tryItOut.missingBaseUrl'));
            return;
        }

        try {
            setCurlCommand(generateCurlCommand(getRequestConfig()));
        } catch (error) {
            reportError(
                error instanceof Error
                    ? error.message
                    : t('tryItOut.generateCurlFailed'),
            );
        }
    }

    async function handleCopyCurl() {
        if (!curlCommand) {
            return;
        }

        await navigator.clipboard.writeText(curlCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleExecute() {
        if (!effectiveBaseUrl) {
            reportError(t('tryItOut.missingBaseUrl'));
            return;
        }

        setResponse(undefined);

        let requestConfig;

        try {
            requestConfig = getRequestConfig();
        } catch (error) {
            reportError(
                error instanceof Error
                    ? error.message
                    : t('tryItOut.requestFailed'),
            );
            return;
        }

        startExecuting(async () => {
            try {
                const proxyResponse = await fetch('/api/proxy', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestConfig),
                });

                const data = (await proxyResponse.json()) as
                    ProxySuccess | ProxyFailure;

                if ('error' in data) {
                    reportError(data.error);
                    return;
                }

                setResponse(data);
            } catch (error) {
                reportError(
                    error instanceof Error
                        ? error.message
                        : t('tryItOut.requestFailed'),
                );
            }
        });
    }

    return (
        <div className="min-w-0 max-w-full rounded-xl border border-fuchsia-300/20 bg-fuchsia-400/5 p-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-fuchsia-200">
                {t('tryItOut.title')}
            </h4>

            {baseUrl ? (
                <p className="mt-2 font-mono text-xs text-cyan-100/55">
                    {t('tryItOut.baseUrl')}: {baseUrl}
                </p>
            ) : (
                <label className="mt-3 flex flex-col gap-2 text-sm font-semibold text-cyan-100/80">
                    {t('tryItOut.baseUrl')}
                    <input
                        value={customBaseUrl}
                        onChange={(event) =>
                            setCustomBaseUrl(event.target.value)
                        }
                        placeholder={t('tryItOut.baseUrlPlaceholder')}
                        className={inputClassName}
                    />
                </label>
            )}

            <div className="mt-4 flex flex-col gap-4">
                <ParameterInputs
                    title={t('tryItOut.path')}
                    requiredLabel={t('tryItOut.required')}
                    parameters={groupedParameters.path}
                    values={pathParams}
                    onChange={(name, value) =>
                        updateParam(setPathParams, name, value)
                    }
                />
                <ParameterInputs
                    title={t('tryItOut.query')}
                    requiredLabel={t('tryItOut.required')}
                    parameters={groupedParameters.query}
                    values={queryParams}
                    onChange={(name, value) =>
                        updateParam(setQueryParams, name, value)
                    }
                />
                <ParameterInputs
                    title={t('tryItOut.headers')}
                    requiredLabel={t('tryItOut.required')}
                    parameters={groupedParameters.header}
                    values={headerParams}
                    onChange={(name, value) =>
                        updateParam(setHeaderParams, name, value)
                    }
                />
                <ParameterInputs
                    title={t('tryItOut.cookies')}
                    requiredLabel={t('tryItOut.required')}
                    parameters={groupedParameters.cookie}
                    values={cookieParams}
                    onChange={(name, value) =>
                        updateParam(setCookieParams, name, value)
                    }
                />

                {hasRequestBody ? (
                    <div className="flex flex-col gap-3">
                        {contentTypes.length > 1 ? (
                            <label className="flex flex-col gap-2 text-sm font-semibold text-cyan-100/80">
                                {t('tryItOut.contentType')}
                                <select
                                    value={contentType}
                                    onChange={(event) => {
                                        const nextContentType =
                                            event.target.value;
                                        setContentType(nextContentType);
                                        setBody(
                                            formatExample(
                                                getMediaTypeExample(
                                                    endpoint.requestBody
                                                        ?.content?.[
                                                        nextContentType
                                                    ],
                                                ),
                                            ),
                                        );
                                    }}
                                    className={inputClassName}
                                >
                                    {contentTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        ) : (
                            <p className="text-xs font-mono text-cyan-100/55">
                                {t('tryItOut.contentType')}: {contentType}
                            </p>
                        )}

                        <label className="flex flex-col gap-2 text-sm font-semibold text-cyan-100/80">
                            {t('tryItOut.requestBody')}
                            <textarea
                                value={body}
                                onChange={(event) =>
                                    setBody(event.target.value)
                                }
                                rows={6}
                                className={`${inputClassName} resize-y`}
                            />
                        </label>
                    </div>
                ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={handleExecute}
                    disabled={isExecuting || !effectiveBaseUrl}
                    className="rounded-md bg-gradient-to-r from-cyan-300 to-fuchsia-400 px-4 py-2 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isExecuting
                        ? t('tryItOut.executing')
                        : t('tryItOut.execute')}
                </button>
                <button
                    type="button"
                    onClick={handleGenerateCurl}
                    disabled={!effectiveBaseUrl}
                    className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {t('tryItOut.generateCurl')}
                </button>
                {curlCommand ? (
                    <button
                        type="button"
                        onClick={handleCopyCurl}
                        className="rounded-md border border-fuchsia-300/30 bg-fuchsia-400/10 px-4 py-2 text-sm font-semibold text-fuchsia-100 transition hover:text-fuchsia-200"
                    >
                        {copied ? t('tryItOut.copied') : t('tryItOut.copyCurl')}
                    </button>
                ) : null}
            </div>

            {curlCommand ? (
                <pre className="mt-4 max-h-48 w-full max-w-full overflow-auto whitespace-pre-wrap break-words rounded-lg border border-cyan-300/10 bg-black/50 p-3 font-mono text-xs leading-relaxed text-cyan-100/85">
                    {curlCommand}
                </pre>
            ) : null}

            {response ? (
                <div className="mt-4 min-w-0 max-w-full space-y-4 rounded-lg border border-cyan-300/15 bg-black/35 p-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="font-bold text-fuchsia-200">
                            {t('tryItOut.statusLabel')}: {response.status}{' '}
                            {response.statusText}
                        </span>
                        <span className="text-cyan-100/60">
                            {t('history.duration')}: {response.durationMs} ms
                        </span>
                    </div>

                    <div className="min-w-0 max-w-full">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                            {t('tryItOut.responseHeaders')}
                        </p>
                        <pre className="mt-2 max-h-96 w-full max-w-full overflow-auto whitespace-pre-wrap break-words rounded-lg border border-cyan-300/10 bg-black/50 p-3 font-mono text-xs text-cyan-100/85">
                            {JSON.stringify(response.headers, null, 2)}
                        </pre>
                    </div>

                    <div className="min-w-0 max-w-full">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                            {t('tryItOut.responseBody')}
                        </p>
                        <pre className="mt-2 max-h-96 w-full max-w-full overflow-auto whitespace-pre-wrap break-words rounded-lg border border-cyan-300/10 bg-black/50 p-3 font-mono text-xs text-cyan-100/85">
                            {formatResponseBody(response.body)}
                        </pre>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
