'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useI18n } from '@/components/i18n/locale-provider';

export function HeaderNav() {
    const pathname = usePathname();
    const { t } = useI18n();

    const navItems = [
        {
            href: '/',
            label: t('nav.editor'),
        },
        {
            href: '/about',
            label: t('nav.about'),
        },
    ];

    return (
        <nav className="flex items-center gap-3 text-sm font-medium">
            {navItems.map((item) => {
                const isActive =
                    item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={
                            isActive
                                ? 'rounded-md border border-cyan-300/25 bg-cyan-300/8 px-2.5 py-1.5 font-bold text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.12)]'
                                : 'rounded-md px-2.5 py-1.5 text-cyan-100/70 transition hover:text-cyan-300'
                        }
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
