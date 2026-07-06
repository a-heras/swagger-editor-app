import type { Dictionary } from './types';

export function createTranslator(dictionary: Dictionary) {
    return (key: string, values?: Record<string, string | number>) =>
        translate(dictionary, key, values);
}

export function translate(
    dictionary: Dictionary,
    key: string,
    values?: Record<string, string | number>,
): string {
    const parts = key.split('.');
    let current: unknown = dictionary;

    for (const part of parts) {
        if (
            typeof current !== 'object' ||
            current === null ||
            !(part in current)
        ) {
            return key;
        }

        current = (current as Record<string, unknown>)[part];
    }

    if (typeof current !== 'string') {
        return key;
    }

    if (!values) {
        return current;
    }

    return Object.entries(values).reduce(
        (result, [placeholder, value]) =>
            result.replaceAll(`{${placeholder}}`, String(value)),
        current,
    );
}
