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
        role: 'Developer',
        github: 'https://github.com/a-heras',
    },
];

const resources = [
    {
        label: 'RS School React Course',
        href: 'https://rs.school/courses/reactjs',
    },
    {
        label: 'Project Repository',
        href: 'https://github.com/a-heras/swagger-editor-app',
    },
    {
        label: 'Live Demo',
        href: 'https://swagger-editor-app-2077.netlify.app',
    },
];

const actionLinkClassName =
    'inline-flex rounded-md border border-fuchsia-300/40 bg-fuchsia-400/10 px-4 py-2 text-sm font-semibold text-fuchsia-200 shadow-[0_0_18px_rgba(217,70,239,0.15)] transition hover:border-fuchsia-300/70 hover:bg-fuchsia-400/20 hover:text-fuchsia-100';

function getGithubUsername(url: string) {
    return url.replace('https://github.com/', '@');
}

export default function AboutPage() {
    return (
        <section className="flex flex-1">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
                        About Project
                    </p>
                    <h1 className="mt-3 bg-gradient-to-r from-cyan-200 via-fuchsia-300 to-yellow-200 bg-clip-text pb-1 text-4xl font-black leading-tight text-transparent">
                        Swagger Editor App
                    </h1>
                    <p className="mt-4 max-w-3xl text-cyan-100/70">
                        This application is built as a final project for the RS
                        School React course. It combines an OpenAPI editor and
                        viewer, a Try It Out REST client with server-side
                        proxying, and authenticated request history with
                        analytics.
                    </p>
                </div>

                <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-6 shadow-[0_0_30px_rgba(34,211,238,0.1)] backdrop-blur-xl">
                    <h2 className="text-xl font-black text-cyan-200">
                        RS School Course
                    </h2>
                    <p className="mt-3 text-cyan-100/65">
                        RS School is a free educational program by The Rolling
                        Scopes community focused on modern JavaScript, React,
                        teamwork, and production-oriented development practices.
                        The React course covers component architecture, routing,
                        state management, testing, and real-world project
                        delivery.
                    </p>
                    <a
                        href="https://rs.school/courses/reactjs"
                        className={`mt-4 ${actionLinkClassName}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Visit RS School React
                    </a>
                </section>

                <section className="rounded-2xl border border-fuchsia-300/20 bg-slate-950/70 p-6 shadow-[0_0_30px_rgba(217,70,239,0.1)] backdrop-blur-xl">
                    <h2 className="text-xl font-black text-fuchsia-200">
                        Team
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
                                    {member.role}
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
                        Technologies
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
                        Resources
                    </h2>
                    <p className="mt-3 text-cyan-100/65">
                        Useful links for reviewing the course, source code, and
                        deployed application.
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
                                {resource.label}
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </section>
    );
}
