'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    {
        href: '/',
        label: 'Editor',
    },
    {
        href: '/about',
        label: 'About',
    },
];

export function HeaderNav() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center gap-4 text-sm font-medium">
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
                                ? 'rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 font-bold text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.18)]'
                                : 'rounded-md px-3 py-2 text-cyan-100/75 transition hover:text-cyan-300'
                        }
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
