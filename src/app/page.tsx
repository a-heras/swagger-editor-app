import { loadSavedSchema } from '@/app/actions/schema';
import { AuthFeedbackToast } from '@/components/auth/auth-feedback-toast';
import { SwaggerWorkspace } from '@/components/swagger/swagger-workspace';
import { getDictionary } from '@/i18n/get-dictionary';
import { getLocale } from '@/i18n/get-locale';
import { createTranslator } from '@/i18n/translate';

export default async function HomePage() {
    const savedSchema = await loadSavedSchema();
    const locale = await getLocale();
    const dictionary = await getDictionary(locale);
    const t = createTranslator(dictionary);

    return (
        <section className="flex flex-1 flex-col">
            <AuthFeedbackToast />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-8">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
                        {t('home.eyebrow')}
                    </p>
                    <h1 className="mt-3 max-w-3xl bg-gradient-to-r from-cyan-200 via-fuchsia-300 to-yellow-200 bg-clip-text pb-1 text-3xl font-black leading-tight tracking-tight text-transparent md:text-5xl">
                        {t('home.title')}
                    </h1>
                    <p className="mt-5 max-w-2xl text-cyan-100/70">
                        {t('home.description')}
                    </p>
                </div>

                <SwaggerWorkspace initialSchema={savedSchema?.content} />
            </div>
        </section>
    );
}
