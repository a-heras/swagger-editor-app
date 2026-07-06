'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

import { useI18n } from '@/components/i18n/locale-provider';
import { showSuccess } from '@/lib/ui/toast';

function AuthFeedbackToastInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useI18n();
    const shownRef = useRef(false);

    useEffect(() => {
        const successKey = searchParams.get('successKey');
        const success = searchParams.get('success');
        const message = successKey ? t(successKey) : success;

        if (!message || shownRef.current) {
            return;
        }

        shownRef.current = true;
        showSuccess(message);

        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.delete('success');
        nextParams.delete('successKey');
        const query = nextParams.toString();

        router.replace(query ? `${pathname}?${query}` : pathname, {
            scroll: false,
        });
    }, [pathname, router, searchParams, t]);

    return null;
}

export function AuthFeedbackToast() {
    return (
        <Suspense fallback={null}>
            <AuthFeedbackToastInner />
        </Suspense>
    );
}
