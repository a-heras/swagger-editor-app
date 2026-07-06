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
        <section>
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
                        About Project
                    </p>
                    <h1 className="mt-3 bg-gradient-to-r from-cyan-200 via-fuchsia-300 to-yellow-200 bg-clip-text text-4xl font-black text-transparent">
                        Swagger Editor App
                    </h1>
                    <p className="mt-4 max-w-3xl text-cyan-100/70">
                        This application is built as a final project for the RS
                        School React course. It helps users edit OpenAPI
                        specifications, inspect API endpoints, execute requests,
                        and analyze request history.
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
                    </p>
                </section>

                <section className="rounded-2xl border border-fuchsia-300/20 bg-slate-950/70 p-6 shadow-[0_0_30px_rgba(217,70,239,0.1)] backdrop-blur-xl">
                    <h2 className="text-xl font-black text-fuchsia-200">
                        Developer
                    </h2>

                    <article className="mt-4 rounded-xl border border-cyan-300/20 bg-black/30 p-4">
                        <h3 className="font-semibold text-cyan-100">
                            {developer.name}
                        </h3>
                        <p className="mt-1 text-sm text-cyan-100/60">
                            {developer.role}
                        </p>
                        <a
                            href={developer.github}
                            className="mt-3 inline-flex text-sm font-semibold text-cyan-300 hover:text-fuchsia-300"
                            target="_blank"
                            rel="noreferrer"
                        >
                            GitHub
                        </a>
                    </article>
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
            </div>
        </section>
    );
}
