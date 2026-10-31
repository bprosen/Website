import type { Job } from '~/types';
import { MOMENTUM_REPO_URL } from './links';
import { EMPLOYER, JOB_TITLE } from './profile';

export const WORK: readonly Job[] = [
  {
    company: EMPLOYER,
    id: 'w1',
    period: '2025 to now',
    role: JOB_TITLE,
    roleNote: 'Co-op, then part-time, then full-time',
    stats: [
      { label: 'of impressions reported', value: 'Billions' },
      { label: 'builds, down from minutes', value: '<10s' },
    ],
    summary: `Led the frontend of a new ad reporting dashboard for enterprise customers, from first idea to production launch. Built its architecture, testing standards and CI/CD pipeline, including the first Docker Compose setup for end-to-end tests. Also moved ${EMPLOYER}'s other web apps from Create React App to Vite, cutting builds from minutes to under 10\u00a0seconds.`,
    tech: [
      'React',
      'TypeScript',
      'TanStack',
      'Playwright',
      'Storybook',
      'Java',
    ],
  },
  {
    collage: [
      {
        alt: 'The Renatus Network hub: giant King Kong and Godzilla builds over floating mountain islands',
        height: 856,
        label: 'Hub',
        src: '/media/renatus/hub.jpg',
        width: 1600,
      },
      {
        alt: 'Parkour gameplay switching into Infinite mode, with Momentum’s live stats scoreboard',
        height: 450,
        label: 'Infinite mode',
        src: '/media/renatus/parkour-infinite.jpg',
        video: '/media/renatus/parkour-infinite.mp4',
        width: 800,
      },
      {
        alt: 'Parkour practice mode, with Momentum tracking the run on the scoreboard',
        height: 406,
        label: 'Practice mode',
        src: '/media/renatus/parkour-practice.jpg',
        video: '/media/renatus/parkour-practice.mp4',
        width: 720,
      },
    ],
    company: 'Renatus Network',
    id: 'w2',
    link: { href: MOMENTUM_REPO_URL, label: 'View Momentum' },
    period: '2019 to 2026',
    role: 'Owner and Lead Developer',
    roleNote: 'Minecraft game server',
    stats: [
      { label: 'unique players', value: '2M+' },
      { label: 'staff led', value: '30+' },
      { label: 'of stable uptime', value: '500+\u00a0days' },
    ],
    summary:
      'Grew the community 1,300% while leading development and a staff team across every role. Built Momentum, the server’s core management plugin: it tracked advanced player stats, ran the parkour level system, automated events and much more for 250,000+ players.',
    tech: ['Java', 'MySQL', 'Ubuntu'],
  },
  {
    company: 'Priceline',
    id: 'w3',
    period: '2024',
    role: 'Software Developer Co-op',
    roleNote: 'Work term 2',
    summary:
      'Built a partners table to give dozens of internal users faster access to White Label partner data, and developed features like email resend, print itinerary and trip summary for the new trip lookup platform across hotels, cars and flights.',
    tech: ['React', 'Remix', 'Storybook'],
  },
  {
    company: 'Varian',
    id: 'w4',
    period: '2024',
    role: 'Software Developer Co-op',
    roleNote: 'Work term 1',
    summary:
      'Unified toast messages across multiple actions into one consistent experience for physicians and nurses, and researched UI testing best practices to help the team write higher-quality tests.',
    tech: ['Angular', 'Tailwind'],
  },
];
