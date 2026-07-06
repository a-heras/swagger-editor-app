import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <p>Swagger Editor App for RS School React course.</p>

                <nav className="flex items-center gap-4">
                    <Link href="/" className="hover:text-slate-950">
                        Editor
                    </Link>
                    <Link href="/about" className="hover:text-slate-950">
                        About
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
