import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Head from 'next/head';

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <html lang='en'>
    <Head>
      <title>Ben Edgar-Prosen</title>
      <link href='/favicon.ico' rel='icon' sizes='any' />
      <link href='/icon.png' rel='icon' sizes='any' type='image/png' />
      <link
        href='/apple-icon.png'
        rel='apple-touch-icon'
        sizes='any'
        type='image/png'
      />
    </Head>
    <body>
      {children}
      <SpeedInsights />
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
