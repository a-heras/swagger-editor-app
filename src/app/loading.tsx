import { PageLoader } from '@/components/ui/page-loader';
import { getDictionary } from '@/i18n/get-dictionary';
import { getLocale } from '@/i18n/get-locale';
import { createTranslator } from '@/i18n/translate';

export default async function Loading() {
    const locale = await getLocale();
    const dictionary = await getDictionary(locale);
    const t = createTranslator(dictionary);

    return <PageLoader label={t('common.loading')} />;
}
