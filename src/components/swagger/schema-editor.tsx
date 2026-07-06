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
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                        Editor
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Format: {format ?? 'unknown'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={Boolean(error) || isSaving}
                        className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save schema'}
                    </button>

                    <button
                        type="button"
                        onClick={onToggleFormat}
                        disabled={!format}
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Convert to {format === 'json' ? 'YAML' : 'JSON'}
                    </button>
                </div>
            </div>

            {error ? (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {saveMessage ? (
                <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                    {saveMessage}
                </div>
            ) : null}

            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="min-h-[420px] w-full resize-none rounded-lg border border-slate-200 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none"
                placeholder="Paste your OpenAPI schema here..."
            />
        </section>
    );
}
