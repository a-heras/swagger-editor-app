import type { Locale } from './config';
import type { Dictionary } from './types';

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
    en: () => import('./locales/en.json').then((module) => module.default),
    ru: () => import('./locales/ru.json').then((module) => module.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
    return dictionaries[locale]();
}
