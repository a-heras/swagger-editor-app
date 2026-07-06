import type { ApiEndpoint } from '@/lib/openapi/types';

type SchemaViewerProps = {
    endpoints: ApiEndpoint[];
};

export function SchemaViewer({ endpoints }: SchemaViewerProps) {
    return (
        <section className="rounded-2xl border border-fuchsia-300/20 bg-slate-950/70 p-5 shadow-[0_0_35px_rgba(217,70,239,0.12)] backdrop-blur-xl">
            <h2 className="text-lg font-black uppercase tracking-[0.22em] text-fuchsia-200">
                Viewer
            </h2>
            <p className="mt-3 text-sm text-cyan-100/65">
                Valid endpoints from the schema appear here automatically.
            </p>

            {endpoints.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-cyan-300/30 bg-cyan-300/5 p-6 text-center text-sm text-cyan-100/55">
                    No schema loaded yet.
                </div>
            ) : (
                <div className="mt-6 flex flex-col gap-4">
                    {endpoints.map((endpoint) => (
                        <article
                            key={endpoint.id}
                            className="rounded-xl border border-cyan-300/15 bg-black/35 p-4 transition hover:border-fuchsia-300/50 hover:shadow-[0_0_24px_rgba(217,70,239,0.16)]"
                        >
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="rounded-md bg-cyan-300 px-2 py-1 text-xs font-black uppercase text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
                                    {endpoint.method}
                                </span>
                                <h3 className="font-mono text-sm font-semibold text-cyan-100">
                                    {endpoint.path}
                                </h3>
                            </div>

                            {endpoint.summary ? (
                                <p className="mt-3 text-sm text-fuchsia-100/80">
                                    {endpoint.summary}
                                </p>
                            ) : null}

                            <div className="mt-4 grid gap-3 text-sm text-cyan-100/60">
                                <p>
                                    Parameters:{' '}
                                    <span className="font-semibold text-cyan-200">
                                        {endpoint.parameters.length}
                                    </span>
                                </p>
                                <p>
                                    Request body:{' '}
                                    <span className="font-semibold text-cyan-200">
                                        {endpoint.requestBody ? 'yes' : 'no'}
                                    </span>
                                </p>
                                <p>
                                    Responses:{' '}
                                    <span className="font-semibold text-cyan-200">
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
