import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { LocaleProvider } from '@/components/i18n/locale-provider';
import { AppToaster } from '@/components/ui/app-toaster';
import { getDictionary } from '@/i18n/get-dictionary';
import { getLocale } from '@/i18n/get-locale';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Swagger Editor App',
    description: 'Build, preview, and test API specifications',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();
    const dictionary = await getDictionary(locale);

    return (
        <html
            lang={locale}
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col">
                <LocaleProvider locale={locale} dictionary={dictionary}>
                    <AppToaster />
                    <Header />
                    <main className="flex flex-1 flex-col">{children}</main>
                    <Footer />
                </LocaleProvider>
            </body>
        </html>
    );
}
