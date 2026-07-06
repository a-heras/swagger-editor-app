'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
    hasAuthValidationErrors,
    validateAuthForm,
    type AuthValidationErrors,
} from '@/lib/auth/validation';

type AuthFormProps = {
    title: string;
    description: string;
    submitLabel: string;
    action: (formData: FormData) => Promise<void>;
    errorMessage?: string;
    infoMessage?: string;
};

export function AuthForm({
    title,
    description,
    submitLabel,
    action,
    errorMessage,
    infoMessage,
}: AuthFormProps) {
    const [errors, setErrors] = useState<AuthValidationErrors>({});
    const [visibleErrorMessage] = useState(errorMessage);
    const [visibleInfoMessage] = useState(infoMessage);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!visibleErrorMessage && !visibleInfoMessage) {
            return;
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
        }
    }

    return (
        <div className="w-full max-w-md rounded-2xl border border-cyan-300/20 bg-slate-950/75 p-6 shadow-[0_0_40px_rgba(34,211,238,0.14)] backdrop-blur-xl">
            <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
                    Authentication
                </p>
                <h1 className="mt-3 bg-gradient-to-r from-cyan-200 to-fuchsia-300 bg-clip-text text-3xl font-black text-transparent">
                    {title}
                </h1>
                <p className="mt-3 text-cyan-100/65">{description}</p>
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
                    Email
                    <input
                        name="email"
                        type="email"
                        placeholder="name@example.com"
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
                            {errors.email}
                        </span>
                    ) : null}
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-cyan-100/80">
                    Password
                    <input
                        name="password"
                        type="password"
                        placeholder="At least 8 characters"
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
                            {errors.password}
                        </span>
                    ) : null}
                </label>

                <button
                    type="submit"
                    className="mt-2 rounded-md bg-gradient-to-r from-cyan-300 to-fuchsia-400 px-4 py-2 font-bold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.28)] transition hover:scale-[1.02]"
                >
                    {submitLabel}
                </button>
            </form>
        </div>
    );
}
