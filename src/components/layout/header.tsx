import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { HeaderLocaleSwitcher } from '@/components/i18n/header-locale-switcher';
import { HeaderAuthLinks } from './header-auth-links';
import { HeaderNav } from './header-nav';
import { StickyHeader } from './sticky-header';

export async function Header() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isAuthenticated = Boolean(user);

    return (
        <StickyHeader>
            <div className="site-header__inner mx-auto flex max-w-7xl items-center justify-between px-6">
                <Link
                    href="/"
                    className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-yellow-200 bg-clip-text text-base font-black uppercase tracking-[0.2em] text-transparent"
                >
                    Swagger_2077
                </Link>

                <HeaderNav />

                <div className="flex items-center gap-2">
                    <HeaderLocaleSwitcher />

                    <HeaderAuthLinks isAuthenticated={isAuthenticated} />
                </div>
            </div>
        </StickyHeader>
    );
}
