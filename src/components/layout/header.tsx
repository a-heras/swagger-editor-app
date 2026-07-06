import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { HeaderAuthLinks } from './header-auth-links';
import { HeaderNav } from './header-nav';

export async function Header() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isAuthenticated = Boolean(user);

    return (
        <header className="sticky top-0 z-50 border-b border-cyan-400/20 bg-slate-950/75 shadow-[0_0_35px_rgba(34,211,238,0.12)] backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link
                    href="/"
                    className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-yellow-200 bg-clip-text text-lg font-black uppercase tracking-[0.25em] text-transparent"
                >
                    Swagger_2077
                </Link>

                <HeaderNav />

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]"
                    >
                        EN
                    </button>

                    <HeaderAuthLinks isAuthenticated={isAuthenticated} />
                </div>
            </div>
        </header>
    );
}
