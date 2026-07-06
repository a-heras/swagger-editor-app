const technologies = [
    'Next.js App Router',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'OpenAPI',
];

const developer = {
    name: 'Artem',
    role: 'Developer',
    github: 'https://github.com/a-heras',
};

export default function AboutPage() {
    return (
        <section className="bg-slate-50">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                        About Project
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-950">
                        Swagger Editor App
                    </h1>
                    <p className="mt-3 max-w-3xl text-slate-600">
                        This application is built as a final project for the RS
                        School React course. It helps users edit OpenAPI
                        specifications, inspect API endpoints, execute requests,
                        and analyze request history.
                    </p>
                </div>

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-950">
                        RS School Course
                    </h2>
                    <p className="mt-3 text-slate-600">
                        RS School is a free educational program by The Rolling
                        Scopes community focused on modern JavaScript, React,
                        teamwork, and production-oriented development practices.
                    </p>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-950">
                        Developer
                    </h2>

                    <article className="mt-4 rounded-lg border border-slate-200 p-4">
                        <h3 className="font-semibold text-slate-950">
                            {developer.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                            {developer.role}
                        </p>
                        <a
                            href={developer.github}
                            className="mt-3 inline-flex text-sm font-medium text-slate-900 hover:text-slate-600"
                            target="_blank"
                            rel="noreferrer"
                        >
                            GitHub
                        </a>
                    </article>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-950">
                        Technologies
                    </h2>
                    <ul className="mt-4 flex flex-wrap gap-3">
                        {technologies.map((technology) => (
                            <li
                                key={technology}
                                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                            >
                                {technology}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </section>
    );
}
