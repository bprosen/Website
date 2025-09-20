import { SpeedInsights } from "@vercel/speed-insights/next";

type RootLayoutProps = {
    children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
    <html lang="en">
        <body>
            {children}
            <SpeedInsights />
        </body>
    </html>
)

export default RootLayout;