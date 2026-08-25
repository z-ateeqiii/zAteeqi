# zateeqi — portfolio + admin dashboard

Personal portfolio for **Muhammed Al-Ateeqi** — Software Engineer, Angular /
Frontend — with a private `/admin` dashboard for managing the projects shown
on the site. Built as a live demo of the same skills it markets: Angular
signals/standalone components, Firebase Authentication, Firestore, and
role-based access control.

Full design and content spec: [`PORTFOLIO_SPEC.md`](./PORTFOLIO_SPEC.md).

## Tech stack

- Angular 21 (standalone components, signals, `@for`/`@if`)
- Tailwind CSS v4
- `@angular/fire` — Firebase Authentication + Firestore
- No SSR — static hosting on Netlify

## Getting started

```bash
npm install
npm start        # ng serve — http://localhost:4200
```

### Firebase setup (required before Auth/Firestore work)

1. Create a Firebase project with **Firestore** and **Authentication →
   Email/Password** enabled, and create one admin user.
2. Copy the web app config into `src/environments/environment.ts` and
   `src/environments/environment.prod.ts` (both ship placeholder values).
3. Deploy the security rules and indexes:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```
4. Sign in at `/admin` and click **Seed starter projects** to populate the
   `projects` collection from `src/app/core/data/starter-projects.data.ts`.

## Project structure

```
src/app/
├── core/           # models, services (auth, projects, analytics), Firebase providers, static content data
├── features/
│   ├── public-site/  # hero, projects grid, about, experience, contact
│   └── admin/         # login, dashboard, project form/row
└── shared/          # topbar, status-dot, reveal-on-scroll directive
```

Each component keeps its `.ts`, `.html`, and `.scss` in separate files —
no inline templates or styles.

## Routes

| Route     | Description                                                     |
| --------- | ---------------------------------------------------------------- |
| `/`       | Public site — single scrollable page, anchor-scroll navigation  |
| `/admin`  | Login screen if signed out, dashboard if signed in (no guard — `AdminComponent` branches on an `isSignedIn` signal) |

## Building & deployment

```bash
npm run build     # outputs to dist/zateeqi/browser
```

Deploy the `dist/zateeqi/browser` folder to Netlify (drag-and-drop or
`netlify deploy`). Firebase config values are safe to ship client-side —
access control lives entirely in `firestore.rules`.

## Testing

```bash
npm test          # Vitest unit tests
```
