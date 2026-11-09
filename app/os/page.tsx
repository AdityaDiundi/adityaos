import type { Metadata } from "next";
import { AdityaOSDesktop } from "@/components/System/AdityaOSDesktop";

export const metadata: Metadata = {
  title: "AdityaOS - Interactive Web Desktop & Creative Sandbox",
  description:
    "An interactive browser-based operating system featuring pixel art engine, Conway's Game of Life, falling sand physics, terminal, and window manager.",
  alternates: {
    canonical: "https://adityaos-delta.vercel.app/os",
  },
  openGraph: {
    title: "AdityaOS - Interactive Web Desktop & Creative Sandbox",
    description:
      "Interactive browser desktop shell with pixel art canvas, physics engines, and custom window manager.",
    url: "https://adityaos-delta.vercel.app/os",
    siteName: "AdityaOS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AdityaOS Desktop Shell",
      },
    ],
  },
};

export default function OSPage() {
  return <AdityaOSDesktop initialViewMode="os" />;
}
