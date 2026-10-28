import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import type { ReactNode } from 'react';
import {
  COLORS,
  OG_DESCRIPTION,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from '~/constants';
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
  themeColor: COLORS.paper,
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html className={`${fraunces.variable} ${dmSans.variable}`} lang='en'>
    <body>
      {children}
      <SpeedInsights />
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
