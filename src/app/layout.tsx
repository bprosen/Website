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
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link
        rel="icon"
        href="/icon.png"
        type="image/png"
        sizes="any"
      />
      <link
        rel="apple-touch-icon"
        href="/apple-icon.png"
        type="image/png"
        sizes="any"
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
