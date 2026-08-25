import { Project, ProjectWithId } from '../models/project.model';

export const STARTER_PROJECTS: Record<string, Project> = {
  'scholarship-ops': {
    title: 'Scholarship Operation Dashboard',
    route: '/projects/scholarship-ops',
    description:
      'Serverless platform for the Engineers Syndicate scholarship program, with admin and instructor sides for managing groups, schedules, and administrative workflows. Multi-role access built on Firebase Authentication and Firestore security rules, with denormalized ownership fields for reliable rule-level checks.',
    tags: ['Angular 21', 'Firebase Auth', 'Firestore', 'RxJS', 'Signals', 'Tailwind CSS'],
    liveUrl: 'https://scholarship-operation-dashboard.vercel.app',
    githubUrl: 'https://github.com/z-ateeqiii/ScholarshipOperationDashboard',
    status: 'live',
    order: 1,
  },
  'employee-portal': {
    title: 'Employee Portal Guide',
    route: '/projects/employee-portal',
    description:
      'Internal training and onboarding portal with six content categories, category-based routing, lazy-loaded modules, breadcrumb navigation, and a sidebar lesson tracker. Role-based access via route guards and reactive state via Angular Signals, deployed to production.',
    tags: ['Angular 21', 'RxJS', 'Signals', 'Tailwind CSS'],
    liveUrl: 'https://st-employees-tutorial.vercel.app',
    githubUrl: 'https://github.com/z-ateeqiii/st-employees-portal',
    status: 'live',
    order: 2,
  },
  freshcart: {
    title: 'FreshCart — eCommerce',
    route: '/projects/freshcart',
    description:
      'Responsive eCommerce frontend with product listing, dynamic filtering, cart management, and JWT authentication, optimized with lazy loading and deployed on Netlify.',
    tags: ['Angular 17', 'Tailwind CSS', 'RxJS', 'REST APIs', 'Netlify'],
    liveUrl: 'https://freshcarteco.netlify.app/login',
    githubUrl: 'https://github.com/z-ateeqiii/eCommerceAngular',
    status: 'live',
    order: 3,
  },
  cyber50: {
    title: 'Cyber50 — Security Analytics',
    route: '/projects/cyber50',
    description:
      'Six interactive data-visualization modules analyzing cybersecurity attack patterns, with real-time RxJS-driven filtering and a custom 1,000+ incident dataset with CSV export.',
    tags: ['Angular 17', 'D3.js', 'RxJS', 'Tailwind CSS'],
    liveUrl: 'https://cyber-50-defense-dashboard.vercel.app',
    githubUrl: 'https://github.com/z-ateeqiii/cyber-50-defense-dashboard',
    status: 'live',
    order: 4,
  },
  'digital-menu': {
    title: 'Digital Menu',
    route: '/projects/digital-menu',
    description:
      'Bilingual (Arabic/English) digital café menu, JSON-driven with full RTL support for Arabic — built with Angular 21 and Tailwind CSS v4.',
    tags: ['Angular 21', 'Tailwind CSS', 'i18n / RTL'],
    liveUrl: 'https://nutella-one.vercel.app',
    githubUrl: 'https://github.com/z-ateeqiii/Nutella-',
    status: 'draft',
    order: 5,
  },
};

/**
 * The same seed records as a sorted array, used as the public site's local
 * fallback whenever Firestore is unconfigured, unreachable, or still empty.
 * Firestore remains the source of truth the moment it returns anything.
 */
export const STARTER_PROJECT_LIST: ProjectWithId[] = Object.entries(STARTER_PROJECTS)
  .map(([id, project]) => ({ id, ...project }))
  .sort((a, b) => a.order - b.order);

export const STARTER_LIVE_PROJECTS: ProjectWithId[] = STARTER_PROJECT_LIST.filter(
  (project) => project.status === 'live',
);
