type PageLoaderProps = {
    label?: string;
};

export function PageLoader({ label = 'Loading...' }: PageLoaderProps) {
    return (
        <section
            className="flex flex-1 items-center justify-center px-6 py-20"
            aria-busy="true"
            aria-live="polite"
        >
            <div className="flex flex-col items-center gap-5">
                <div className="site-loader" role="status" aria-label={label}>
                    <span className="site-loader__ring" />
                    <span className="site-loader__core" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300/70">
                    {label}
                </p>
            </div>
        </section>
    );
}
