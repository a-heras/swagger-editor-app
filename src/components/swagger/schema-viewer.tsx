import type { ApiEndpoint } from '@/lib/openapi/types';

type SchemaViewerProps = {
    endpoints: ApiEndpoint[];
};

export function SchemaViewer({ endpoints }: SchemaViewerProps) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Viewer</h2>
            <p className="mt-3 text-sm text-slate-600">
                Valid endpoints from the schema appear here automatically.
            </p>

            {endpoints.length === 0 ? (
                <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                    No schema loaded yet.
                </div>
            ) : (
                <div className="mt-6 flex flex-col gap-4">
                    {endpoints.map((endpoint) => (
                        <article
                            key={endpoint.id}
                            className="rounded-lg border border-slate-200 p-4"
                        >
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="rounded-md bg-slate-900 px-2 py-1 text-xs font-bold uppercase text-white">
                                    {endpoint.method}
                                </span>
                                <h3 className="font-mono text-sm font-semibold text-slate-950">
                                    {endpoint.path}
                                </h3>
                            </div>

                            {endpoint.summary ? (
                                <p className="mt-3 text-sm text-slate-700">
                                    {endpoint.summary}
                                </p>
                            ) : null}

                            <div className="mt-4 grid gap-3 text-sm text-slate-600">
                                <p>
                                    Parameters:{' '}
                                    <span className="font-medium text-slate-950">
                                        {endpoint.parameters.length}
                                    </span>
                                </p>
                                <p>
                                    Request body:{' '}
                                    <span className="font-medium text-slate-950">
                                        {endpoint.requestBody ? 'yes' : 'no'}
                                    </span>
                                </p>
                                <p>
                                    Responses:{' '}
                                    <span className="font-medium text-slate-950">
                                        {Object.keys(endpoint.responses).join(
                                            ', ',
                                        ) || 'none'}
                                    </span>
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
