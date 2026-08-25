# Muhammed Al-Ateeqi — Portfolio + Admin Dashboard: Build Spec

Hand this file to Claude Code as the implementation spec.

### 2.1 Overview

A conversion-focused personal portfolio for Muhammed, positioned as a
**Software Engineer — Angular / Frontend**. The site is designed to support
job applications and direct client opportunities: it should make the value
clear quickly, showcase strong real projects, and provide a frictionless
email contact path.

A private `/admin` dashboard lets Muhammed publish, edit, hide, and reorder
projects without touching code or redeploying. The dashboard is also a live
proof point for authentication, authorization, Firestore CRUD, and security
rules — but the portfolio's primary goal is conversion, not demonstrating
how much infrastructure was built.

**Primary visual reference:** a friend's portfolio
(`benitopedro.vercel.app`, source at `github.com/BenitoPedro13/portfolio`).

Use this reference for the **overall visual direction and level of polish**,
not just the architecture. Recreate a similar visual language: dark premium
interface, typography hierarchy, spacing rhythm, section composition,
navigation behavior, project presentation, stat/metric blocks, borders and
dividers, subtle motion, hover interactions, and responsive behavior.

The result must feel inspired by the same design direction while remaining an
**original portfolio for Muhammed**. Do not copy source code, components,
text/copy, SVGs, assets, images, or implementation details from the reference
repository. It is built in Next.js/React; we are re-implementing the design
direction natively in Angular 21 + Tailwind CSS, with original code,
components, content, and structure.

The reference should guide:
- Overall visual direction and visual density
- Dark background / surface treatment
- Typography scale and hierarchy
- Spacing and layout rhythm
- Hero composition
- Navigation and section composition
- Project presentation
- Stats / metrics presentation
- Experience section
- Contact section
- Animation and interaction concepts
- Responsive behavior

Do not reproduce the reference pixel-for-pixel. Preserve the visual character
and quality bar while adapting the design to Muhammed's content, projects,
identity, and Angular implementation.

**Branding rule:** Do not invent a completely different visual system from
the reference. The existing palette below should be treated as the starting
point for Muhammed's original adaptation, and colors may be adjusted only
when needed to match the reference's visual feel while keeping the portfolio
visually distinct and accessible.

### 2.2 Tech stack

- **Angular 21** (standalone components, signals, `@for`/`@if` control flow — matches every other project on the CV, keep it consistent)
- **Tailwind CSS v4**
- **@angular/fire** for Firebase Auth + Firestore (client SDK)
- **Angular Router** — two routes: `''` (public site) and `/admin` (guarded)
- No SSR needed for v1 (static hosting on Netlify, same as other repos)
- Fonts: Space Grotesk (display), IBM Plex Sans (body), JetBrains Mono (labels/data/routes) — via Google Fonts

### 2.3 Design system (already designed and approved — implement exactly)

**Concept:** the portfolio behaves like the kind of role-based operational
dashboard Muhammed actually builds — route-styled nav, a boot-sequence
hero, and a live "status strip" of real stats. This is the site's
signature, not generic decoration.

**Color tokens:**

```
--ink: #0a0d12            /* page background */
--surface: #12161d        /* card background */
--surface-2: #171c25      /* input/nested surface */
--border: #232a35

--text: #e7eaef
--text-muted: #8a93a3
--text-faint: #565f6f

--signal-blue: #4c8dff    /* primary accent — links, primary actions */
--signal-green: #34d399   /* status: live */
--signal-amber: #f5a623   /* status: draft/in progress */
--signal-coral: #ff6b57   /* secondary accent, use sparingly */

```

Background: deep ink, not pure black — subtle radial gradients only
(blue top-left \~10% opacity, coral top-right \~6% opacity), fixed
attachment. No decorative gradients elsewhere.

**Typography:**

- Display (`Space Grotesk`, 500–700): hero title, section titles, card titles
- Body (`IBM Plex Sans`, 400–600): paragraphs, nav, buttons
- Mono (`JetBrains Mono`, 400–500): route labels, status labels, tags, eyebrows, timestamps — this is what gives the "system UI" feel, use it consistently for anything that reads like metadata

**Signature elements (implement all of these — they ARE the design):**

1. **Route indicator** in the topbar (`/home`, `/projects`, `/about`, `/experience`, `/contact`) that updates via `IntersectionObserver` as the visitor scrolls past each section.
2. **Boot sequence** in the hero: 2–3 monospace lines that fade in in sequence (`> initializing session...`, `> role: visitor · access: granted`, `> loading /home`) with a blinking cursor. Must respect `prefers-reduced-motion` (skip straight to final state).
3. **Status strip**: a 4-cell bordered row under the hero CTA showing
credible, stable proof points. Do not use vanity metrics that are difficult
to understand or verify. Final cells (do not substitute — these are the
verifiable numbers from the CV):
   - Cell 1: count of `live` projects, dynamic from Firestore (currently 4)
   - Cell 2: "Angular 17+" — label: "core focus"
   - Cell 3: "180/180" — label: "B.Sc. Computer Science · Excellent"
   - Cell 4: "95%" — label: "positive feedback · Mindset Training"
4. **Project cards as "deployment records"**: status dot (live=green pulsing / draft=amber) + route path (`/projects/scholarship-ops`) + mono tech tags + live/source links — not generic portfolio cards. **The route path is a display-only mono-text string, not a real Angular route.** No case-study pages or routing for it in v1 — clicking a card goes nowhere; only the explicit "Live demo" / "Source" links are clickable. Don't wire up `/projects/:slug` routes.
5. Session label in topbar: `role: visitor` on the public site, `role: admin (email)` once signed into `/admin` — same visual language reused, reinforcing that this is one small role-based app.

**Motion:** one orchestrated hero boot sequence + staggered scroll-reveal
on project cards (fade + translateY, \~60ms stagger) + subtle hover lift
and blue glow on cards + slow pulse on the "live" status dot. Nothing
beyond this list — no extra decorative animation.

### 2.4 Site structure / routes

Single-page public site with in-page sections (anchor-scrollable), plus a
separate guarded admin route:

```
/                    → public site (sections: hero, projects, about,
                        experience, contact — all in one scrollable page,
                        topbar nav scrolls to anchors)
/admin               → login screen if signed out,
                        dashboard if signed in

```

**No** **`CanActivate`** **route guard.** `/admin` is a single route/component.
`AdminComponent` reads an `isSignedIn` signal from `AuthService` and
conditionally renders `<app-admin-login>` or `<app-admin-dashboard>`
internally — same pattern as the working `admin.html` prototype already
built. A guard would imply redirecting to a separate `/admin/login`
route, which is not the design here — don't add one.

### 2.5 Suggested Angular project structure

**Important code-organization rule:** Keep Angular templates, component logic,
and component styles in separate files. Do **not** use inline `template`,
inline `styles`, or large HTML/CSS/TypeScript files that mix responsibilities.
Each component should normally have its own `.ts`, `.html`, and `.css`/`.scss`
files. Keep services, models, directives, and Firebase configuration separate
from UI components.

Example:

```text
src/app/
├── core/
│   ├── models/
│   │   └── project.model.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── projects.service.ts
│   │   └── analytics.service.ts
│   └── firebase/
│       └── firebase.providers.ts
│
├── features/
│   ├── public-site/
│   │   ├── public-site.component.ts
│   │   ├── public-site.component.html
│   │   ├── public-site.component.scss
│   │   ├── hero/
│   │   │   ├── hero.component.ts
│   │   │   ├── hero.component.html
│   │   │   └── hero.component.scss
│   │   ├── projects-grid/
│   │   │   ├── projects-grid.component.ts
│   │   │   ├── projects-grid.component.html
│   │   │   └── projects-grid.component.scss
│   │   ├── about/
│   │   │   ├── about.component.ts
│   │   │   ├── about.component.html
│   │   │   └── about.component.scss
│   │   ├── experience-timeline/
│   │   │   ├── experience-timeline.component.ts
│   │   │   ├── experience-timeline.component.html
│   │   │   └── experience-timeline.component.scss
│   │   └── contact/
│   │       ├── contact.component.ts
│   │       ├── contact.component.html
│   │       └── contact.component.scss
│   │
│   └── admin/
│       ├── admin.component.ts
│       ├── admin.component.html
│       ├── admin.component.scss
│       ├── admin-login/
│       │   ├── admin-login.component.ts
│       │   ├── admin-login.component.html
│       │   └── admin-login.component.scss
│       ├── admin-dashboard/
│       │   ├── admin-dashboard.component.ts
│       │   ├── admin-dashboard.component.html
│       │   └── admin-dashboard.component.scss
│       ├── project-form/
│       │   ├── project-form.component.ts
│       │   ├── project-form.component.html
│       │   └── project-form.component.scss
│       └── project-row/
│           ├── project-row.component.ts
│           ├── project-row.component.html
│           └── project-row.component.scss
│
├── shared/
│   ├── components/
│   │   ├── topbar/
│   │   │   ├── topbar.component.ts
│   │   │   ├── topbar.component.html
│   │   │   └── topbar.component.scss
│   │   └── status-dot/
│   │       ├── status-dot.component.ts
│   │       ├── status-dot.component.html
│   │       └── status-dot.component.scss
│   └── directives/
│       └── reveal-on-scroll.directive.ts
│
├── app.routes.ts
├── app.config.ts
└── styles.scss
```

**Component rule:** TypeScript contains component behavior/state, HTML
contains markup/template structure, and SCSS contains component-specific
styling. Tailwind utility classes are allowed in HTML, but do not turn a
single component file into a large mixed HTML/TS/CSS implementation.

**File-size/readability rule:** If a component becomes difficult to understand,
split it into smaller components rather than creating one large component.



### 2.6 Content (real — use as-is, do not invent placeholder content)

**Profile:**

- Name: Muhammed Al-Ateeqi · Handle: `zateeqi`
- Role: Software Engineer — Angular / Frontend
- Location: Cairo, Egypt
- Email: mu.alateeqi\@gmail.com
- LinkedIn: linkedin.com/in/zateeqi · GitHub: github.com/z-ateeqiii

**Privacy / contact decision:** Do not display Muhammed's personal phone
number anywhere on the public portfolio. Email is the primary contact method.
The CV may continue to contain the phone number separately.

**Hero copy:**

- Title: "Building role-based systems people trust with their data."
- Subhead: "I'm Muhammed — a software engineer specializing in Angular and frontend systems. I build production-focused dashboards and business applications with real authorization, reactive state, and maintainable architecture."

**Projects** (id / title / description / tags / liveUrl / githubUrl / status / order):

| id title status live URL repo  |                                 |           |                                            |                                                     |
| ------------------------------ | ------------------------------- | --------- | ------------------------------------------ | --------------------------------------------------- |
| scholarship-ops                | Scholarship Operation Dashboard | live      | scholarship-operation-dashboard.vercel.app | github.com/z-ateeqiii/ScholarshipOperationDashboard |
| employee-portal                | Employee Training Portal        | live      | st-employees-tutorial.vercel.app           | github.com/z-ateeqiii/st-employees-portal           |
| freshcart                      | FreshCart — eCommerce SSR       | live      | freshcarteco.netlify.app/login             | github.com/z-ateeqiii/eCommerceAngular              |
| cyber50                        | Cyber50 — Security Analytics    | live      | cyber-50-defense-dashboard.vercel.app      | github.com/z-ateeqiii/cyber-50-defense-dashboard    |
| digital-menu                   | Digital Menu                    | **draft** | nutella-one.vercel.app                     | github.com/z-ateeqiii/Nutella-                      |

Full descriptions and tag lists: reuse verbatim from the CV project
bullets already shared in this conversation (Scholarship Management
Platform, Employee Portal Guide, FreshCart, Cyber50, plus Digital Menu as
a draft entry). `digital-menu` seeds as `status: draft` on purpose —
Muhammed said it still needs polish before going public.

**Experience timeline:** the four roles from the CV (Smart Technology,
iSchool, Mindset Training, Codology) with dates, org, and one-line
description each — reuse verbatim from the CV.

**Skills chips:** grouped as Frontend / Data & Security / Tooling, using
the CORE SKILLS section of the CV.

**About copy:** reuse the CV's professional summary, rewritten in first
person, plus one line noting this site itself is the small role-based
Firebase app it's describing.

### 2.7 Firestore data model

**Collection:** `projects`, document ID = project slug (e.g.
`scholarship-ops`)

```ts
interface Project {
  title: string;
  route: string;          // display-only label, e.g. "/projects/scholarship-ops"
                           // — NOT a real Angular route, purely visual
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  status: 'live' | 'draft';
  order: number;
}

```

**Security rules** (`firestore.rules`):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      allow read: if resource.data.status == 'live' || request.auth != null;
      allow write: if request.auth != null;
    }
  }
}

```

Single admin account — "signed in" == "admin" for this app. No roles
collection needed at this scale.

### 2.8 Admin dashboard requirements

- `/admin` shows a login form (email + password via Firebase Auth) when signed out.
- Once signed in: list of all projects (including drafts), each row inline-editable (title, description, route, tags, liveUrl, githubUrl, status, order) with a **Save** and **Delete** button per row.
- An **Add project** form at the top of the dashboard.
- A **"Seed starter projects"** button that bulk-writes the 5 projects from §2.6 into Firestore (upsert by ID).
- A private **Analytics** section for Muhammed only. The public site must not display a visitor counter. Track at minimum total page views, unique visitors/sessions, views over time, and the most-viewed project links/CTAs.
- Topbar on `/admin` reuses the same route-indicator/session-label component as the public site, showing `role: guest` vs `role: admin (email)`.

**Analytics implementation — decided, no external provider:**

Reuse Firestore (no new service, no new backend, no signup). Add one
collection, `analytics_events`, written by anonymous public visitors and
read only by the signed-in admin:

```ts
interface AnalyticsEvent {
  type: 'pageview' | 'cta_click';
  target?: string;       // for cta_click: which link, e.g. "live:scholarship-ops"
  sessionId: string;     // random UUID, generated client-side, stored in
                          // localStorage — anonymous, not tied to identity
  createdAt: Timestamp;  // serverTimestamp()
}
```

Security rules addition:
```
match /analytics_events/{eventId} {
  allow create: if request.resource.data.keys().hasAll(['type','sessionId','createdAt'])
                && request.resource.data.type in ['pageview', 'cta_click'];
  allow read, update, delete: if request.auth != null;
}
```

Admin dashboard reads this collection (auth required, per the rule above)
and computes: total events, unique `sessionId` count, events grouped by day
for a simple trend, and a count grouped by `target` for most-clicked
project links. All aggregation happens client-side in the admin dashboard
component — no Cloud Functions, no scheduled jobs.

**Known v1 trade-off:** the `create` rule is open to any unauthenticated
client, so it's technically possible for someone to spam junk events. At
personal-portfolio traffic volumes this is an acceptable risk; it just
means the numbers could be padded, not that data leaks or gets deleted (no
public read/delete). Revisit with rate-limiting only if it actually
becomes a problem — don't build that defensively now.

**Privacy note:** `sessionId` is a random client-generated UUID, not an IP,
fingerprint, or identity — no cookie-consent banner needed for this.

### 2.9 Non-functional requirements

- Fully responsive down to \~360px width; topbar nav collapses to a toggle menu below \~720px
- Visible keyboard focus states on all interactive elements
- Respect `prefers-reduced-motion` everywhere motion is used
- No dead links — every "Live demo" / "Source" link must resolve
- Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95 on the public route

### 2.10 Deployment

- Netlify, same as the other projects (drag-and-drop or `netlify deploy`)
- Firebase config values are safe to ship in the client bundle — actual access control lives in `firestore.rules`, deployed separately via `firebase deploy --only firestore:rules`
- Keep deployment simple. Do not introduce SSR, a custom server, or additional backend infrastructure in v1 unless a concrete requirement appears.

### 2.11 Explicitly out of scope for v1

- No blog/case-study MDX pages (future roadmap item, not now)
- No contact-form backend — mailto link is enough for v1
- No multi-admin/roles collection — one admin account is enough at this scale
- No image uploads in the dashboard yet — `liveUrl`/`githubUrl`/text only
- No Fullstack positioning on the public site until Muhammed has real backend project evidence
- No custom analytics backend just for visitor counting
- No unnecessary backend stack (Node/Express/Nest/PostgreSQL/etc.) for the portfolio itself
- No public phone number

---


## 2.12 Conversion / $5k-month objective

The portfolio is the first asset in a one-month plan to reach a $5,000
monthly income target. It must therefore optimize for **trust, clarity, and
contact**, not technical complexity.

### Primary outcomes

1. A recruiter/client understands Muhammed's role and strongest value within
   the first 10–20 seconds.
2. The strongest projects are immediately visible and easy to open.
3. Every important section leads naturally toward contact.
4. Email is the primary conversion action.
5. Visitor analytics are private and used to improve the portfolio rather
   than displayed as a vanity counter.
6. The site itself demonstrates engineering quality through the admin system,
   authentication, Firestore rules, responsive behavior, accessibility, and
   performance.

### Positioning

Use **Software Engineer — Angular / Frontend** consistently across the public
site. Do not claim **Fullstack Engineer** yet. Backend learning can happen
alongside the income plan, but the portfolio should market skills that
Muhammed can already demonstrate with real project evidence.

### CTA

Primary CTA: **Email me**

Secondary CTA: **View projects**

Do not make the visitor search for how to contact Muhammed. Keep the email CTA
visible in the hero and repeat it in the contact section.

### Scope rule

If a feature does not materially improve trust, conversion, portfolio
management, or demonstrated engineering skill, it should not block v1.

## Decisions log

- Portfolio structure takes inspiration from a friend's Next.js portfolio (architecture/animation concepts only, friend has approved this use) — rebuilt natively in Angular 21 + Tailwind v4, fully original code and copy.
- Firebase/Firestore chosen for the CMS layer specifically because it's Muhammed's strongest stack overlap with existing production work — the portfolio becomes a live demo of the RBAC skill it's marketing.
- `digital-menu` project ships as `draft` until Muhammed flips it to `live` from the dashboard.

- Public positioning is **Software Engineer — Angular / Frontend**, not Fullstack.
- Personal phone number is intentionally excluded from the public portfolio; email is the primary contact method.
- Visitor analytics are private; no public visitor counter.
- Analytics implemented via a Firestore `analytics_events` collection
  (public create, admin-only read) instead of an external provider —
  reuses the existing project, no new signup, no custom backend. Accepted
  trade-off: open write access could be spammed at personal-portfolio
  scale; not worth defending against in v1.
- v1 prioritizes conversion and speed of delivery over adding a new backend stack.
- Angular components must keep `.ts`, `.html`, and `.scss`/`.css` in separate files for readability and maintainability.
