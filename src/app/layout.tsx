import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

type RootLayoutProps = {
  children: React.ReactNode;
};

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <html lang='en'>
    <body>
      {children}
      <SpeedInsights />
      <Analytics />
    </body>
  </html>
);
