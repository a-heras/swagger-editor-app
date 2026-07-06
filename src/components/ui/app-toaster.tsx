'use client';

import { Toaster } from 'sonner';

export function AppToaster() {
    return (
        <Toaster
            position="top-right"
            theme="dark"
            richColors
            closeButton
            toastOptions={{
                classNames: {
                    toast: 'border border-cyan-300/20 bg-slate-950/95 text-cyan-100 shadow-[0_0_25px_rgba(34,211,238,0.15)] backdrop-blur-xl',
                    title: 'font-semibold text-cyan-100',
                    description: 'text-cyan-100/70',
                    error: 'border-red-400/40 bg-red-500/10 text-red-100',
                    success: 'border-cyan-300/40 bg-cyan-400/10 text-cyan-100',
                },
            }}
        />
    );
}
