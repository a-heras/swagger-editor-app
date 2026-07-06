import { getDictionary } from '@/i18n/get-dictionary';
import { getLocale } from '@/i18n/get-locale';
import { createTranslator } from '@/i18n/translate';

const technologies = [
    'Next.js App Router',
    'React 19',
    'TypeScript',
    'Tailwind CSS 4',
    'Supabase',
    'OpenAPI / Swagger',
    'Vitest',
];

const teamMembers = [
    {
        name: 'Artem Heras',
        roleKey: 'about.developer',
        github: 'https://github.com/a-heras',
    },
];

const resources = [
    {
        labelKey: 'about.courseLink',
        href: 'https://rs.school/courses/reactjs',
    },
    {
        labelKey: 'about.repoLink',
        href: 'https://github.com/a-heras/swagger-editor-app',
    },
    {
        labelKey: 'about.demoLink',
        href: 'https://swagger-editor-app-2077.netlify.app',
    },
];

const actionLinkClassName =
    'inline-flex rounded-md border border-fuchsia-300/40 bg-fuchsia-400/10 px-4 py-2 text-sm font-semibold text-fuchsia-200 shadow-[0_0_18px_rgba(217,70,239,0.15)] transition hover:border-fuchsia-300/70 hover:bg-fuchsia-400/20 hover:text-fuchsia-100';

function getGithubUsername(url: string) {
    return url.replace('https://github.com/', '@');
}

export default async function AboutPage() {
    const locale = await getLocale();
    const dictionary = await getDictionary(locale);
    const t = createTranslator(dictionary);

    return (
        <section className="flex flex-1">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
                        {t('about.eyebrow')}
                    </p>
                    <h1 className="mt-3 bg-gradient-to-r from-cyan-200 via-fuchsia-300 to-yellow-200 bg-clip-text pb-1 text-4xl font-black leading-tight text-transparent">
                        {t('about.title')}
                    </h1>
                    <p className="mt-4 max-w-3xl text-cyan-100/70">
                        {t('about.description')}
                    </p>
                </div>

                <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-6 shadow-[0_0_30px_rgba(34,211,238,0.1)] backdrop-blur-xl">
                    <h2 className="text-xl font-black text-cyan-200">
                        {t('about.courseTitle')}
                    </h2>
                    <p className="mt-3 text-cyan-100/65">
                        {t('about.courseDescription')}
                    </p>
                    <a
                        href="https://rs.school/courses/reactjs"
                        className={`mt-4 ${actionLinkClassName}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t('about.visitCourse')}
                    </a>
                </section>

                <section className="rounded-2xl border border-fuchsia-300/20 bg-slate-950/70 p-6 shadow-[0_0_30px_rgba(217,70,239,0.1)] backdrop-blur-xl">
                    <h2 className="text-xl font-black text-fuchsia-200">
                        {t('about.teamTitle')}
                    </h2>

                    <div className="mt-4 grid gap-4">
                        {teamMembers.map((member) => (
                            <article
                                key={member.github}
                                className="rounded-xl border border-cyan-300/20 bg-black/30 p-4"
                            >
                                <h3 className="font-semibold text-cyan-100">
                                    {member.name}
                                </h3>
                                <p className="mt-1 text-sm text-cyan-100/60">
                                    {t(member.roleKey)}
                                </p>
                                <a
                                    href={member.github}
                                    className={`mt-3 ${actionLinkClassName}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {getGithubUsername(member.github)}
                                </a>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-yellow-200/20 bg-slate-950/70 p-6 shadow-[0_0_30px_rgba(250,204,21,0.08)] backdrop-blur-xl">
                    <h2 className="text-xl font-black text-yellow-100">
                        {t('about.technologiesTitle')}
                    </h2>
                    <ul className="mt-4 flex flex-wrap gap-3">
                        {technologies.map((technology) => (
                            <li
                                key={technology}
                                className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100"
                            >
                                {technology}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-6 shadow-[0_0_30px_rgba(34,211,238,0.1)] backdrop-blur-xl">
                    <h2 className="text-xl font-black text-cyan-200">
                        {t('about.resourcesTitle')}
                    </h2>
                    <p className="mt-3 text-cyan-100/65">
                        {t('about.resourcesDescription')}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {resources.map((resource) => (
                            <a
                                key={resource.href}
                                href={resource.href}
                                className={actionLinkClassName}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t(resource.labelKey)}
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </section>
    );
}
