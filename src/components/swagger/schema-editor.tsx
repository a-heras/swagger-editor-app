import type { SchemaFormat } from '@/lib/openapi/types';

type SchemaEditorProps = {
    value: string;
    format?: SchemaFormat;
    error?: string;
    saveMessage?: string;
    isSaving: boolean;
    onChange: (value: string) => void;
    onToggleFormat: () => void;
    onSave: () => void;
};

export function SchemaEditor({
    value,
    format,
    error,
    saveMessage,
    isSaving,
    onChange,
    onToggleFormat,
    onSave,
}: SchemaEditorProps) {
    return (
        <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-5 shadow-[0_0_35px_rgba(34,211,238,0.12)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-black uppercase tracking-[0.22em] text-cyan-200">
                        Editor
                    </h2>
                    <p className="mt-1 text-sm text-fuchsia-200/70">
                        Format: {format ?? 'unknown'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={Boolean(error) || isSaving}
                        className="rounded-md bg-gradient-to-r from-cyan-300 to-fuchsia-400 px-3 py-2 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save schema'}
                    </button>

                    <button
                        type="button"
                        onClick={onToggleFormat}
                        disabled={!format}
                        className="rounded-md border border-fuchsia-300/30 bg-fuchsia-300/10 px-3 py-2 text-sm font-semibold text-fuchsia-100 transition hover:border-fuchsia-300/70 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Convert to {format === 'json' ? 'YAML' : 'JSON'}
                    </button>
                </div>
            </div>

            {error ? (
                <div className="mb-4 rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                </div>
            ) : null}

            {saveMessage ? (
                <div className="mb-4 rounded-md border border-cyan-300/40 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
                    {saveMessage}
                </div>
            ) : null}

            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="min-h-[420px] w-full resize-none rounded-xl border border-cyan-300/20 bg-black/70 p-4 font-mono text-sm text-cyan-100 shadow-inner shadow-cyan-950/60 outline-none transition focus:border-cyan-300/60 focus:shadow-[0_0_25px_rgba(34,211,238,0.18)]"
                placeholder="Paste your OpenAPI schema here..."
            />
        </section>
    );
}
