import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';

type RootLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  icons: {
    apple: '/apple-icon.png',
    icon: [
      { sizes: 'any', url: '/favicon.ico' },
      { type: 'image/png', url: '/icon.png' },
    ],
  },
  title: 'Ben Edgar-Prosen',
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <html lang='en'>
    <body>
      {children}
      <SpeedInsights />
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
