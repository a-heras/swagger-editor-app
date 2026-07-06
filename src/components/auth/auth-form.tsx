'use client';

import { useState } from 'react';

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
};

export function AuthForm({
    title,
    description,
    submitLabel,
    action,
}: AuthFormProps) {
    const [errors, setErrors] = useState<AuthValidationErrors>({});

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
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Authentication
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-950">
                    {title}
                </h1>
                <p className="mt-3 text-slate-600">{description}</p>
            </div>

            <form
                action={action}
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col gap-4"
                noValidate
            >
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                    Email
                    <input
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                            errors.email ? 'email-error' : undefined
                        }
                    />
                    {errors.email ? (
                        <span
                            id="email-error"
                            className="text-sm font-normal text-red-600"
                        >
                            {errors.email}
                        </span>
                    ) : null}
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                    Password
                    <input
                        name="password"
                        type="password"
                        placeholder="At least 8 characters"
                        className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={
                            errors.password ? 'password-error' : undefined
                        }
                    />
                    {errors.password ? (
                        <span
                            id="password-error"
                            className="text-sm font-normal text-red-600"
                        >
                            {errors.password}
                        </span>
                    ) : null}
                </label>

                <button
                    type="submit"
                    className="mt-2 rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
                >
                    {submitLabel}
                </button>
            </form>
        </div>
    );
}
