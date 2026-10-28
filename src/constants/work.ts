import type { WorkEntry } from '~/types';

export const WORK: readonly WorkEntry[] = [
  {
    company: 'Taiv',
    id: 'w1',
    period: '2025 to now',
    role: 'Software Developer',
    roleNote: 'Co-op, then part-time, then full-time',
    stats: [
      { label: 'of impressions in the dashboard I led', value: 'Billions' },
      { label: 'builds, down from minutes', value: '<10s' },
    ],
    summary:
      'Led the frontend of a new ad reporting dashboard for enterprise customers, from first idea to production launch. Set up the frontend architecture and testing standards, and moved the build from Create React App to Vite.',
    tech: ['React', 'TypeScript', 'TanStack', 'Storybook', 'Java'],
  },
  {
    collage: [
      { label: 'Hub or spawn screenshot' },
      { label: 'Community event' },
      { label: 'Momentum in action' },
      { label: 'Staff or Discord' },
    ],
    company: 'Renatus Network',
    id: 'w2',
    period: '2019 to 2026',
    role: 'Owner and Lead Developer',
    roleNote: 'Minecraft game server',
    stats: [
      { label: 'unique players', value: '2M+' },
      { label: 'staff led', value: '30+' },
      { label: 'of stable uptime', value: '500+ days' },
    ],
    summary:
      "Grew the community 1,300% while leading development and a staff team across every role. Built Momentum, the server's core management plugin: it tracked advanced player stats, ran the parkour level system, automated events and much more for 250,000+ players.",
    tech: ['Java', 'MySQL', 'Ubuntu'],
  },
  {
    company: 'Priceline',
    id: 'w3',
    period: '2024',
    role: 'Developer Co-op',
    roleNote: 'Work term 2',
    summary:
      'Built a White Label partners table for internal teams, and trip lookup features like email resend, print itinerary and trip summary across hotels, cars and flights.',
    tech: ['React', 'Remix', 'Storybook'],
  },
  {
    company: 'Varian',
    id: 'w4',
    period: '2024',
    role: 'Developer Co-op',
    roleNote: 'Work term 1',
    summary:
      'Researched and evaluated UI testing best practices to raise the bar for testing, and unified toast messages into one consistent experience for physicians and nurses.',
    tech: ['Angular', 'Tailwind'],
  },
];
