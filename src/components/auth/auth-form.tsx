'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useI18n } from '@/components/i18n/locale-provider';
import {
    hasAuthValidationErrors,
    validateAuthForm,
    type AuthValidationErrors,
} from '@/lib/auth/validation';
import { showError, showInfo } from '@/lib/ui/toast';

type AuthFormProps = {
    titleKey: string;
    descriptionKey: string;
    submitLabelKey: string;
    action: (formData: FormData) => Promise<void>;
    errorMessage?: string;
    errorKey?: string;
    infoMessage?: string;
    infoKey?: string;
};

export function AuthForm({
    titleKey,
    descriptionKey,
    submitLabelKey,
    action,
    errorMessage,
    errorKey,
    infoMessage,
    infoKey,
}: AuthFormProps) {
    const { t } = useI18n();
    const [errors, setErrors] = useState<AuthValidationErrors>({});
    const resolvedErrorMessage = errorKey ? t(errorKey) : errorMessage;
    const resolvedInfoMessage = infoKey ? t(infoKey) : infoMessage;
    const [visibleErrorMessage] = useState(resolvedErrorMessage);
    const [visibleInfoMessage] = useState(resolvedInfoMessage);
    const pathname = usePathname();
    const router = useRouter();
    const shownToastRef = useRef<string | null>(null);

    useEffect(() => {
        if (!visibleErrorMessage && !visibleInfoMessage) {
            return;
        }

        const toastKey = visibleErrorMessage ?? visibleInfoMessage ?? '';

        if (toastKey && shownToastRef.current !== toastKey) {
            shownToastRef.current = toastKey;

            if (visibleErrorMessage) {
                showError(visibleErrorMessage);
            } else if (visibleInfoMessage) {
                showInfo(visibleInfoMessage);
            }
        }

        router.replace(pathname, { scroll: false });
    }, [pathname, router, visibleErrorMessage, visibleInfoMessage]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        const formData = new FormData(event.currentTarget);
        const email = String(formData.get('email') ?? '');
        const password = String(formData.get('password') ?? '');
        const nextErrors = validateAuthForm(email, password);

        if (hasAuthValidationErrors(nextErrors)) {
            event.preventDefault();
            setErrors(nextErrors);

            const firstErrorKey = nextErrors.email ?? nextErrors.password;

            if (firstErrorKey) {
                showError(t(firstErrorKey));
            }
        }
    }

    return (
        <div className="w-full max-w-md rounded-2xl border border-cyan-300/20 bg-slate-950/75 p-6 shadow-[0_0_40px_rgba(34,211,238,0.14)] backdrop-blur-xl">
            <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
                    {t('auth.authentication')}
                </p>
                <h1 className="mt-3 bg-gradient-to-r from-cyan-200 to-fuchsia-300 bg-clip-text text-3xl font-black text-transparent">
                    {t(titleKey)}
                </h1>
                <p className="mt-3 text-cyan-100/65">{t(descriptionKey)}</p>
            </div>

            {visibleErrorMessage ? (
                <div className="mt-4 rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {visibleErrorMessage}
                </div>
            ) : null}

            {visibleInfoMessage ? (
                <div className="mt-4 rounded-md border border-cyan-300/40 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
                    {visibleInfoMessage}
                </div>
            ) : null}

            <form
                action={action}
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col gap-4"
                noValidate
            >
                <label className="flex flex-col gap-2 text-sm font-semibold text-cyan-100/80">
                    {t('auth.email')}
                    <input
                        name="email"
                        type="email"
                        placeholder={t('auth.emailPlaceholder')}
                        className="rounded-md border border-cyan-300/20 bg-black/45 px-3 py-2 text-cyan-50 outline-none transition placeholder:text-cyan-100/30 focus:border-cyan-300/70"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                            errors.email ? 'email-error' : undefined
                        }
                    />
                    {errors.email ? (
                        <span
                            id="email-error"
                            className="text-sm font-normal text-red-300"
                        >
                            {t(errors.email)}
                        </span>
                    ) : null}
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-cyan-100/80">
                    {t('auth.password')}
                    <input
                        name="password"
                        type="password"
                        placeholder={t('auth.passwordPlaceholder')}
                        className="rounded-md border border-cyan-300/20 bg-black/45 px-3 py-2 text-cyan-50 outline-none transition placeholder:text-cyan-100/30 focus:border-cyan-300/70"
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={
                            errors.password ? 'password-error' : undefined
                        }
                    />
                    {errors.password ? (
                        <span
                            id="password-error"
                            className="text-sm font-normal text-red-300"
                        >
                            {t(errors.password)}
                        </span>
                    ) : null}
                </label>

                <button
                    type="submit"
                    className="mt-2 rounded-md bg-gradient-to-r from-cyan-300 to-fuchsia-400 px-4 py-2 font-bold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.28)] transition hover:scale-[1.02]"
                >
                    {t(submitLabelKey)}
                </button>
            </form>
        </div>
    );
}
