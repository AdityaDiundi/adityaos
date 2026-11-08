import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aditya Diundi // AdityaOS",
  description:
    "Personal Web Operating System & Interactive Portfolio by Aditya Diundi. Featuring custom graphics engines, creative sandboxes, and full-stack software architecture.",
  metadataBase: new URL("https://adityaos-delta.vercel.app"),
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⟡</text></svg>",
  },
  openGraph: {
    title: "Aditya Diundi // AdityaOS",
    description: "Personal Web Operating System & Interactive Portfolio by Aditya Diundi.",
    url: "https://adityaos-delta.vercel.app",
    siteName: "AdityaOS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Diundi // AdityaOS",
    description: "Personal Web Operating System & Interactive Portfolio by Aditya Diundi.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-onedark-blue/30 selection:text-onedark-textBright">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
