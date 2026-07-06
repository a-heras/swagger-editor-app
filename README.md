# Swagger Editor App

Final project for the [RS School React course](https://rs.school/courses/reactjs). A full-stack Swagger/OpenAPI UI with an editor, viewer, Try It Out REST client, authenticated request history, and analytics.

**Live demo:** [swagger-editor-app-2077.netlify.app](https://swagger-editor-app-2077.netlify.app)

**Repository:** [github.com/a-heras/swagger-editor-app](https://github.com/a-heras/swagger-editor-app)

## Features

- **Editor** — paste and edit OpenAPI/Swagger specs in JSON or YAML with auto-detection, validation, and format conversion
- **Viewer** — explore endpoints grouped by path with parameters, request/response schemas, and status codes
- **Try It Out** — execute API requests through a server-side proxy (no CORS issues), generate and copy cURL commands
- **Auth** — email/password sign-in and sign-up via Supabase with client-side validation
- **History & Analytics** — authenticated users can review executed requests with duration, status, sizes, and payloads
- **i18n** — English and Russian with a header language switcher
- **UX** — sticky animated header, toast notifications, and error boundaries

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) — authentication and database
- [Sonner](https://sonner.emilkowal.ski/) — toast notifications
- [Vitest](https://vitest.dev/) — unit tests

## Team

| Name        | Role      | GitHub                                 |
| ----------- | --------- | -------------------------------------- |
| Artem Heras | Developer | [@a-heras](https://github.com/a-heras) |
