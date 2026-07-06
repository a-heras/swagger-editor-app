'use client';

import type {
    ApiEndpoint,
    OpenApiParameter,
    OpenApiRequestBody,
    OpenApiResponse,
} from '@/lib/openapi/types';
import {
    formatExample,
    formatSchema,
    getMediaTypeExample,
    groupParametersByLocation,
} from '@/lib/openapi/schema-display';
import { TryItOut } from './try-it-out';

type EndpointDetailsProps = {
    endpoint: ApiEndpoint;
    baseUrl: string;
    isOpen: boolean;
    onToggle: () => void;
};

type CodeBlockProps = {
    label: string;
    value: string;
};

function CodeBlock({ label, value }: CodeBlockProps) {
    return (
        <div className="min-w-0 max-w-full">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-200/80">
                {label}
            </p>
            <pre className="mt-2 max-h-96 w-full max-w-full overflow-auto whitespace-pre-wrap break-words rounded-lg border border-cyan-300/10 bg-black/50 p-3 font-mono text-xs leading-relaxed text-cyan-100/85">
                {value}
            </pre>
        </div>
    );
}

type ParameterSectionProps = {
    title: string;
    parameters: OpenApiParameter[];
};

function ParameterSection({ title, parameters }: ParameterSectionProps) {
    return (
        <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                {title}
            </h4>
            {parameters.length === 0 ? (
                <p className="mt-2 text-sm text-cyan-100/45">None</p>
            ) : (
                <ul className="mt-2 flex flex-col gap-2">
                    {parameters.map((parameter) => (
                        <li
                            key={`${parameter.in}-${parameter.name}`}
                            className="rounded-lg border border-cyan-300/10 bg-black/30 p-3"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-sm font-semibold text-cyan-100">
                                    {parameter.name ?? 'unnamed'}
                                </span>
                                {parameter.required ? (
                                    <span className="rounded bg-fuchsia-400/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-fuchsia-200">
                                        required
                                    </span>
                                ) : null}
                            </div>
                            {parameter.description ? (
                                <p className="mt-1 text-sm text-cyan-100/60">
                                    {parameter.description}
                                </p>
                            ) : null}
                            {parameter.schema ? (
                                <pre className="mt-2 overflow-x-auto font-mono text-xs text-cyan-100/70">
                                    {formatSchema(parameter.schema)}
                                </pre>
                            ) : null}
                            {parameter.example !== undefined ? (
                                <p className="mt-2 text-xs text-fuchsia-100/70">
                                    Example:{' '}
                                    <span className="font-mono">
                                        {formatExample(parameter.example)}
                                    </span>
                                </p>
                            ) : null}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

type RequestBodySectionProps = {
    requestBody?: OpenApiRequestBody;
};

function RequestBodySection({ requestBody }: RequestBodySectionProps) {
    if (!requestBody) {
        return (
            <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                    Request Body
                </h4>
                <p className="mt-2 text-sm text-cyan-100/45">None</p>
            </div>
        );
    }

    const contentTypes = Object.entries(requestBody.content ?? {});

    return (
        <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                Request Body
            </h4>
            {requestBody.description ? (
                <p className="mt-2 text-sm text-cyan-100/60">
                    {requestBody.description}
                </p>
            ) : null}
            {requestBody.required ? (
                <p className="mt-1 text-xs font-bold uppercase text-fuchsia-200">
                    Required
                </p>
            ) : null}
            {contentTypes.length === 0 ? (
                <p className="mt-2 text-sm text-cyan-100/45">
                    No content types
                </p>
            ) : (
                <div className="mt-3 flex flex-col gap-4">
                    {contentTypes.map(([contentType, mediaType]) => (
                        <div
                            key={contentType}
                            className="rounded-lg border border-cyan-300/10 bg-black/30 p-3"
                        >
                            <p className="font-mono text-sm text-fuchsia-200">
                                {contentType}
                            </p>
                            {mediaType.schema ? (
                                <div className="mt-3">
                                    <CodeBlock
                                        label="Schema"
                                        value={formatSchema(mediaType.schema)}
                                    />
                                </div>
                            ) : null}
                            <div className="mt-3">
                                <CodeBlock
                                    label="Example"
                                    value={formatExample(
                                        getMediaTypeExample(mediaType),
                                    )}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

type ResponseSectionProps = {
    responses: Record<string, OpenApiResponse>;
};

function ResponseSection({ responses }: ResponseSectionProps) {
    const statusCodes = Object.entries(responses).sort(([left], [right]) =>
        left.localeCompare(right, undefined, { numeric: true }),
    );

    if (statusCodes.length === 0) {
        return (
            <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                    Responses
                </h4>
                <p className="mt-2 text-sm text-cyan-100/45">None</p>
            </div>
        );
    }

    return (
        <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                Responses
            </h4>
            <div className="mt-3 flex flex-col gap-3">
                {statusCodes.map(([statusCode, response]) => {
                    const contentTypes = Object.entries(response.content ?? {});

                    return (
                        <div
                            key={statusCode}
                            className="rounded-lg border border-cyan-300/10 bg-black/30 p-3"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-md bg-fuchsia-400/20 px-2 py-0.5 font-mono text-sm font-bold text-fuchsia-200">
                                    {statusCode}
                                </span>
                                <span className="text-sm text-cyan-100/70">
                                    {response.description ?? 'No description'}
                                </span>
                            </div>
                            {contentTypes.length === 0 ? (
                                <p className="mt-2 text-sm text-cyan-100/45">
                                    No response body
                                </p>
                            ) : (
                                <div className="mt-3 flex flex-col gap-4">
                                    {contentTypes.map(
                                        ([contentType, mediaType]) => (
                                            <div key={contentType}>
                                                <p className="font-mono text-sm text-fuchsia-200">
                                                    {contentType}
                                                </p>
                                                {mediaType.schema ? (
                                                    <div className="mt-2">
                                                        <CodeBlock
                                                            label="Schema"
                                                            value={formatSchema(
                                                                mediaType.schema,
                                                            )}
                                                        />
                                                    </div>
                                                ) : null}
                                                <div className="mt-2">
                                                    <CodeBlock
                                                        label="Example"
                                                        value={formatExample(
                                                            getMediaTypeExample(
                                                                mediaType,
                                                            ),
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function EndpointDetails({
    endpoint,
    baseUrl,
    isOpen,
    onToggle,
}: EndpointDetailsProps) {
    const groupedParameters = groupParametersByLocation(endpoint.parameters);

    return (
        <article className="rounded-xl border border-cyan-300/15 bg-black/35 transition hover:border-fuchsia-300/50 hover:shadow-[0_0_24px_rgba(217,70,239,0.16)]">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-start justify-between gap-3 p-4 text-left"
            >
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-md bg-cyan-300 px-2 py-1 text-xs font-black uppercase text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
                            {endpoint.method}
                        </span>
                        <h3 className="font-mono text-sm font-semibold text-cyan-100">
                            {endpoint.path}
                        </h3>
                    </div>
                    {endpoint.summary ? (
                        <p className="mt-2 text-sm text-fuchsia-100/80">
                            {endpoint.summary}
                        </p>
                    ) : null}
                </div>
                <span className="shrink-0 text-sm text-cyan-100/50">
                    {isOpen ? '−' : '+'}
                </span>
            </button>

            {isOpen ? (
                <div className="space-y-6 border-t border-cyan-300/10 p-4">
                    {endpoint.description ? (
                        <p className="text-sm text-cyan-100/65">
                            {endpoint.description}
                        </p>
                    ) : null}

                    <div className="grid gap-5">
                        <ParameterSection
                            title="Path Parameters"
                            parameters={groupedParameters.path}
                        />
                        <ParameterSection
                            title="Query Parameters"
                            parameters={groupedParameters.query}
                        />
                        <ParameterSection
                            title="Header Parameters"
                            parameters={groupedParameters.header}
                        />
                        <ParameterSection
                            title="Cookie Parameters"
                            parameters={groupedParameters.cookie}
                        />
                    </div>

                    <RequestBodySection requestBody={endpoint.requestBody} />
                    <ResponseSection responses={endpoint.responses} />
                    <TryItOut endpoint={endpoint} baseUrl={baseUrl} />
                </div>
            ) : null}
        </article>
    );
}
