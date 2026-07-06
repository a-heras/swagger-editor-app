export function HistoryLoading() {
    return (
        <div className="rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-8 shadow-[0_0_35px_rgba(34,211,238,0.12)] backdrop-blur-xl">
            <div className="animate-pulse space-y-4">
                <div className="h-6 w-48 rounded bg-cyan-300/15" />
                <div className="h-4 w-full max-w-xl rounded bg-cyan-300/10" />
                <div className="h-4 w-full max-w-lg rounded bg-cyan-300/10" />
                <div className="mt-6 h-24 rounded-xl bg-cyan-300/10" />
            </div>
        </div>
    );
}
