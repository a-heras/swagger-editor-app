import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-fuchsia-400/20 bg-slate-950/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-cyan-100/65 sm:flex-row sm:items-center sm:justify-between">
                <p>Swagger Editor App // RS School React course</p>

                <nav className="flex items-center gap-4">
                    <Link href="/" className="transition hover:text-cyan-300">
                        Editor
                    </Link>
                    <Link
                        href="/about"
                        className="transition hover:text-fuchsia-300"
                    >
                        About
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
