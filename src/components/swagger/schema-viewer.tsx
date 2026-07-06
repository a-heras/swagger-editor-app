'use client';

import { useState } from 'react';

import type { ApiEndpoint } from '@/lib/openapi/types';
import { groupEndpointsByPath } from '@/lib/openapi/schema-display';
import { EndpointDetails } from './endpoint-details';

type SchemaViewerProps = {
    endpoints: ApiEndpoint[];
    baseUrl: string;
};

export function SchemaViewer({ endpoints, baseUrl }: SchemaViewerProps) {
    const [openEndpointId, setOpenEndpointId] = useState<string | null>(null);
    const groupedEndpoints = groupEndpointsByPath(endpoints);

    function handleToggle(endpointId: string) {
        setOpenEndpointId((current) =>
            current === endpointId ? null : endpointId,
        );
    }

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
                <div className="mt-6 flex flex-col gap-6">
                    {groupedEndpoints.map(([path, pathEndpoints]) => (
                        <div key={path}>
                            <h3 className="font-mono text-sm font-bold text-cyan-200">
                                {path}
                            </h3>
                            <div className="mt-3 flex flex-col gap-3">
                                {pathEndpoints.map((endpoint) => (
                                    <EndpointDetails
                                        key={endpoint.id}
                                        endpoint={endpoint}
                                        baseUrl={baseUrl}
                                        isOpen={openEndpointId === endpoint.id}
                                        onToggle={() =>
                                            handleToggle(endpoint.id)
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
