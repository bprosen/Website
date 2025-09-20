import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

type RootLayoutProps = {
    children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
    <html lang="en">
        <body>
            {children}
            <SpeedInsights />
            <Analytics />
        </body>
    </html>
)

export default RootLayout;