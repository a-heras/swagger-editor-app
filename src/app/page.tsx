import { SwaggerWorkspace } from '@/components/swagger/swagger-workspace';

export default function HomePage() {
    return (
        <section className="flex flex-1 flex-col bg-slate-50">
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Swagger/OpenAPI UI
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-950">
                        Build, preview, and test API specifications
                    </h1>
                    <p className="mt-3 max-w-2xl text-slate-600">
                        Paste an OpenAPI schema, validate it, inspect endpoints,
                        and execute requests through the server-side REST
                        client.
                    </p>
                </div>

                <SwaggerWorkspace />
            </div>
        </section>
    );
}
