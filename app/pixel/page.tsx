import type { Metadata } from "next";
import DesktopPage from "../page";

export const metadata: Metadata = {
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
    url: "https://pixel-engine-live.vercel.app/pixel",
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

export default function PixelPage() {
  return <DesktopPage initialViewMode="os" defaultApp="pixelEngine" />;
}
