import { ExperienceEntry } from '../models/experience.model';

export const PROFILE = {
  name: 'Muhammed Al-Ateeqi',
  handle: 'zateeqi',
  role: 'Software Engineer — Angular / Frontend',
  location: 'Cairo, Egypt',
  email: 'mu.alateeqi@gmail.com',
  linkedinUrl: 'https://linkedin.com/in/zateeqi',
  githubUrl: 'https://github.com/z-ateeqiii',
};

export const HERO_COPY = {
  title: 'Building role-based systems people trust with their data.',
  subhead:
    "I'm Muhammed — a software engineer specializing in Angular and frontend systems. I build production-focused dashboards and business applications with real authorization, reactive state, and maintainable architecture.",
};

export const ABOUT_COPY = [
  "I'm a software engineer specializing in Angular and frontend development, with production experience building business and serverless applications end to end — from application architecture and role-based access control to responsive UI and deployment.",
  "I have a strong command of TypeScript, RxJS, Angular Signals, and Reactive Forms, with hands-on work on Firebase Authentication and Firestore security. I've translated real business requirements — training workflows, scholarship operations, CRM logic — into working software, and I'm a practiced technical communicator through frontend and coding instruction.",
  'This site is that same idea in miniature: a small role-based app with real Firebase authentication and Firestore-backed content, not just a portfolio describing one.',
];

export const EXPERIENCE: ExperienceEntry[] = [
  {
    role: 'Software Engineer — Frontend',
    org: 'Smart Technology',
    dates: 'Apr 2026 – Present',
    employment: 'Full-time · Egypt',
    description:
      'Designed and built the Employee Portal Guide and the Scholarship Management Platform for the Engineers Syndicate scholarship, with role-based access, route guards, and reactive state via Angular Signals — delivered to production.',
  },
  {
    role: 'Coding Instructor',
    org: 'iSchool',
    dates: 'Apr 2026 – Jul 2026',
    employment: 'Part-time · Egypt',
    description:
      'Introduced AI concepts to Grade 5 students and guided them through building their first AI project from concept to completion.',
  },
  {
    role: 'Frontend Instructor',
    org: 'Mindset Training',
    dates: 'May 2024 – Aug 2024',
    employment: 'Part-time · Egypt',
    description:
      'Delivered HTML, CSS, and JavaScript fundamentals to students aged 18–20, achieving 95% positive feedback through effective technical communication.',
  },
  {
    role: 'Front-End Web Developer',
    org: 'Codology Software Development',
    dates: 'Sep 2023 – Dec 2023',
    employment: 'Apprenticeship · On-site · Cairo, Egypt',
    description:
      'Migrated a production CRM from Angular v11 to v16, resolving breaking changes and integrating multiple REST API endpoints in a live production environment.',
  },
];

export interface SkillGroup {
  label: string;
  skills: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'Frontend',
    skills: [
      'HTML5',
      'CSS3',
      'JavaScript (ES6+)',
      'TypeScript',
      'Angular 17+',
      'Angular Material',
      'Tailwind CSS',
      'Bootstrap 5',
      'RxJS',
      'Angular Signals',
      'Reactive Forms',
    ],
  },
  {
    label: 'Data & Security',
    skills: [
      'REST APIs',
      'JSON',
      'Firebase',
      'Firestore',
      'Authentication',
      'JWT',
      'Role-Based Access Control',
      'Route Guards',
      'Modular Architecture',
      'Lazy Loading',
      'D3.js',
      'Chart.js',
    ],
  },
  {
    label: 'Tooling',
    skills: ['Git', 'GitHub', 'Postman', 'Figma', 'Netlify'],
  },
];

export const STATUS_STRIP = {
  coreFocus: 'Angular 17+',
  education: '180/180',
  educationLabel: 'B.Sc. Computer Science · Excellent',
  feedback: '95%',
  feedbackLabel: 'positive feedback · Mindset Training',
};
