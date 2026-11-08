import type { Metadata } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const isPixelDomain =
    host.includes("pixel-engine") ||
    host.includes("pixel") ||
    host.includes("sandbox");

  if (isPixelDomain) {
    return {
      title: "Pixel Studio // Retro Creative Sandbox",
      description:
        "Interactive retro pixel art canvas, Conway's Game of Life simulation, falling sand physics, and WebAudio DSP synth.",
      metadataBase: new URL("https://pixel-engine-live.vercel.app"),
      icons: {
        icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🕹️</text></svg>",
      },
      openGraph: {
        title: "Pixel Studio // Retro Creative Sandbox",
        description:
          "Interactive retro pixel art canvas with Conway's Game of Life, falling sand physics, and WebAudio DSP synth in the browser.",
        url: "https://pixel-engine-live.vercel.app",
        siteName: "Pixel Studio",
        images: [
          {
            url: "/pixel_studio_og.png",
            width: 1200,
            height: 630,
            alt: "Pixel Studio - Retro Creative Sandbox",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Pixel Studio // Retro Creative Sandbox",
        description:
          "Interactive retro pixel canvas with Conway's Game of Life, falling sand physics, and WebAudio DSP synth.",
        images: ["/pixel_studio_og.png"],
      },
    };
  }

  return {
    title: "Aditya Diundi // AdityaOS",
    description:
      "Personal Web Operating System & Interactive Portfolio by Aditya Diundi. Featuring custom graphics engines, creative sandboxes, and full-stack software architecture.",
    metadataBase: new URL("https://adityaos-delta.vercel.app"),
    icons: {
      icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⟡</text></svg>",
    },
    openGraph: {
      title: "Pixel Studio // Retro Creative Sandbox",
      description:
        "Interactive retro pixel art canvas with Conway's Game of Life, falling sand physics, and WebAudio DSP synth.",
      url: "https://adityaos-delta.vercel.app",
      siteName: "Pixel Studio",
      images: [
        {
          url: "/pixel_studio_og.png",
          width: 1200,
          height: 630,
          alt: "Pixel Studio - Retro Creative Sandbox",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Pixel Studio // Retro Creative Sandbox",
      description:
        "Interactive retro pixel art canvas with Conway's Game of Life, falling sand physics, and WebAudio DSP synth.",
      images: ["/pixel_studio_og.png"],
    },
  };
}

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
