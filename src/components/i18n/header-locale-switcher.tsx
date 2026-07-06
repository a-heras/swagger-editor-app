'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { setLocale } from '@/app/actions/locale';
import type { Locale } from '@/i18n/config';
import { useI18n } from '@/components/i18n/locale-provider';

const options = ['en', 'ru'] as const;

export function HeaderLocaleSwitcher() {
    const router = useRouter();
    const { locale } = useI18n();
    const [isPending, startTransition] = useTransition();

    function handleChange(nextLocale: Locale) {
        if (nextLocale === locale || isPending) {
            return;
        }

        startTransition(async () => {
            await setLocale(nextLocale);
            router.refresh();
        });
    }

    return (
        <div
            className="relative inline-flex rounded-full bg-[rgb(118_118_128/36%)] p-[3px] shadow-[inset_0_1px_2px_rgb(0_0_0/22%)]"
            role="group"
            aria-label="Language"
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute top-[3px] bottom-[3px] left-[3px] w-[calc(50%-3px)] rounded-full bg-[#f2f2f7] shadow-[0_1px_4px_rgb(0_0_0/28%),0_0_0_0.5px_rgb(255_255_255/55%)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{
                    transform:
                        locale === 'ru' ? 'translateX(100%)' : 'translateX(0)',
                }}
            />

            {options.map((option) => {
                const isActive = locale === option;

                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => handleChange(option)}
                        disabled={isPending}
                        aria-pressed={isActive}
                        className={`relative z-10 min-w-[2.75rem] rounded-full border-0 bg-transparent px-3 py-1.5 text-xs font-semibold tracking-[0.08em] uppercase transition-colors duration-200 ${
                            isActive
                                ? 'text-[#1c1c1e]'
                                : 'text-[rgb(235_235_245/58%)] hover:text-[rgb(235_235_245/82%)]'
                        }`}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );
}
