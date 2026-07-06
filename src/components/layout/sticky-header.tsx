'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type StickyHeaderProps = {
    children: ReactNode;
};

export function StickyHeader({ children }: StickyHeaderProps) {
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [isPinned, setIsPinned] = useState(false);

    useEffect(() => {
        const sentinel = sentinelRef.current;

        if (!sentinel) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsPinned(!entry.isIntersecting);
            },
            { threshold: 0 },
        );

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <div
                ref={sentinelRef}
                className="site-header-sentinel"
                aria-hidden="true"
            />
            <header className={`site-header${isPinned ? ' is-pinned' : ''}`}>
                {children}
            </header>
        </>
    );
}
