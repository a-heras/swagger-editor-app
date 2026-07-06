'use client';

import { createContext, useContext, type ReactNode } from 'react';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/types';
import { translate } from '@/i18n/translate';

type I18nContextValue = {
    locale: Locale;
    dictionary: Dictionary;
    t: (key: string, values?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

type LocaleProviderProps = {
    locale: Locale;
    dictionary: Dictionary;
    children: ReactNode;
};

export function LocaleProvider({
    locale,
    dictionary,
    children,
}: LocaleProviderProps) {
    const value: I18nContextValue = {
        locale,
        dictionary,
        t: (key, values) => translate(dictionary, key, values),
    };

    return (
        <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error('useI18n must be used within LocaleProvider');
    }

    return context;
}
