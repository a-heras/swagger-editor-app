import { DEFAULT_LOCALE, isLocale, type Locale } from './config';

export function getClientLocale(): Locale {
    if (typeof document === 'undefined') {
        return DEFAULT_LOCALE;
    }

    const match = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/);
    const value = match?.[1];

    return value && isLocale(value) ? value : DEFAULT_LOCALE;
}
