import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import type { ReactNode } from 'react';
import {
  COLORS,
  DARK_PAPER,
  DARK_SCHEME_QUERY,
  LIGHT_SCHEME_QUERY,
  OG_DESCRIPTION,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from '~/constants';
import { cn } from '~/lib/ui';
import {
  motionInitScript,
  personStructuredData,
  serializeStructuredData,
  themeInitScript,
} from '~/utils';
import './globals.css';

const fraunces = Fraunces({
  axes: ['opsz'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-fraunces',
});

const dmSans = DM_Sans({
  axes: ['opsz'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    description: OG_DESCRIPTION,
    title: SITE_TITLE,
    type: 'website',
    url: SITE_URL,
  },
  title: SITE_TITLE,
  twitter: {
    card: 'summary_large_image',
    description: OG_DESCRIPTION,
    title: SITE_TITLE,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { color: COLORS.paper, media: LIGHT_SCHEME_QUERY },
    { color: DARK_PAPER, media: DARK_SCHEME_QUERY },
  ],
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html
    className={cn(fraunces.variable, dmSans.variable)}
    data-scroll-behavior='smooth'
    lang='en'
    suppressHydrationWarning
  >
    <head>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: a fixed script built from constants (no user input) that must run before first paint to avoid a light-theme flash.
        dangerouslySetInnerHTML={{
          __html: `${themeInitScript()}${motionInitScript()}`,
        }}
      />
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built from constants and escaped by serializeStructuredData, so no user input reaches the page.
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(personStructuredData()),
        }}
        type='application/ld+json'
      />
    </head>
    <body>
      {children}
      <SpeedInsights />
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
