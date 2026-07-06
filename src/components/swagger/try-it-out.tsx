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
    parameters: OpenApiParameter[];
    values: Record<string, string>;
    onChange: (name: string, value: string) => void;
};

function ParameterInputs({
    title,
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
                                    required
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
    const [errorMessage, setErrorMessage] = useState<string>();
    const [response, setResponse] = useState<ProxySuccess>();
    const [isExecuting, startExecuting] = useTransition();

    const effectiveBaseUrl = (baseUrl || customBaseUrl).trim();

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
            setErrorMessage('Enter a base URL or add servers to the schema.');
            return;
        }

        setErrorMessage(undefined);
        setCurlCommand(generateCurlCommand(getRequestConfig()));
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
            setErrorMessage('Enter a base URL or add servers to the schema.');
            return;
        }

        setErrorMessage(undefined);
        setResponse(undefined);

        const requestConfig = getRequestConfig();

        startExecuting(async () => {
            try {
                const proxyResponse = await fetch('/api/proxy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestConfig),
                });

                const data = (await proxyResponse.json()) as
                    ProxySuccess | ProxyFailure;

                if ('error' in data) {
                    setErrorMessage(data.error);
                    return;
                }

                setResponse(data);
            } catch (error) {
                setErrorMessage(
                    error instanceof Error ? error.message : 'Request failed',
                );
            }
        });
    }

    return (
        <div className="rounded-xl border border-fuchsia-300/20 bg-fuchsia-400/5 p-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-fuchsia-200">
                Try It Out
            </h4>

            {baseUrl ? (
                <p className="mt-2 font-mono text-xs text-cyan-100/55">
                    Base URL: {baseUrl}
                </p>
            ) : (
                <label className="mt-3 flex flex-col gap-2 text-sm font-semibold text-cyan-100/80">
                    Base URL
                    <input
                        value={customBaseUrl}
                        onChange={(event) =>
                            setCustomBaseUrl(event.target.value)
                        }
                        placeholder="https://api.example.com"
                        className={inputClassName}
                    />
                </label>
            )}

            <div className="mt-4 flex flex-col gap-4">
                <ParameterInputs
                    title="Path"
                    parameters={groupedParameters.path}
                    values={pathParams}
                    onChange={(name, value) =>
                        updateParam(setPathParams, name, value)
                    }
                />
                <ParameterInputs
                    title="Query"
                    parameters={groupedParameters.query}
                    values={queryParams}
                    onChange={(name, value) =>
                        updateParam(setQueryParams, name, value)
                    }
                />
                <ParameterInputs
                    title="Headers"
                    parameters={groupedParameters.header}
                    values={headerParams}
                    onChange={(name, value) =>
                        updateParam(setHeaderParams, name, value)
                    }
                />
                <ParameterInputs
                    title="Cookies"
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
                                Content-Type
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
                                Content-Type: {contentType}
                            </p>
                        )}

                        <label className="flex flex-col gap-2 text-sm font-semibold text-cyan-100/80">
                            Request Body
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
                    {isExecuting ? 'Executing...' : 'Execute'}
                </button>
                <button
                    type="button"
                    onClick={handleGenerateCurl}
                    disabled={!effectiveBaseUrl}
                    className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Generate cURL
                </button>
                {curlCommand ? (
                    <button
                        type="button"
                        onClick={handleCopyCurl}
                        className="rounded-md border border-fuchsia-300/30 bg-fuchsia-400/10 px-4 py-2 text-sm font-semibold text-fuchsia-100 transition hover:text-fuchsia-200"
                    >
                        {copied ? 'Copied!' : 'Copy cURL'}
                    </button>
                ) : null}
            </div>

            {errorMessage ? (
                <div className="mt-4 rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {errorMessage}
                </div>
            ) : null}

            {curlCommand ? (
                <pre className="mt-4 overflow-x-auto rounded-lg border border-cyan-300/10 bg-black/50 p-3 font-mono text-xs leading-relaxed text-cyan-100/85">
                    {curlCommand}
                </pre>
            ) : null}

            {response ? (
                <div className="mt-4 space-y-4 rounded-lg border border-cyan-300/15 bg-black/35 p-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="font-bold text-fuchsia-200">
                            Status: {response.status} {response.statusText}
                        </span>
                        <span className="text-cyan-100/60">
                            Duration: {response.durationMs} ms
                        </span>
                    </div>

                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                            Response Headers
                        </p>
                        <pre className="mt-2 overflow-x-auto rounded-lg border border-cyan-300/10 bg-black/50 p-3 font-mono text-xs text-cyan-100/85">
                            {JSON.stringify(response.headers, null, 2)}
                        </pre>
                    </div>

                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                            Response Body
                        </p>
                        <pre className="mt-2 overflow-x-auto rounded-lg border border-cyan-300/10 bg-black/50 p-3 font-mono text-xs text-cyan-100/85">
                            {formatResponseBody(response.body)}
                        </pre>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
