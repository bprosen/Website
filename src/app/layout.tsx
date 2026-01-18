import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

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
      <Script
        id='three-js'
        src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'
      />
      <Script
        id='vanta-net'
        src='https://cdn.jsdelivr.net/npm/vanta/dist/vanta.net.min.js'
      />
      {children}
      <SpeedInsights />
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
