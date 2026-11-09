import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0d10" },
  ],
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const isPixelDomain =
    host.includes("pixel-engine") ||
    host.includes("pixel") ||
    host.includes("sandbox");

  if (isPixelDomain) {
    return {
      title: "Pixel Studio - Retro Creative Sandbox",
      description:
        "Interactive retro pixel art canvas, Conway's Game of Life simulation, falling sand physics, and WebAudio synth in the browser.",
      metadataBase: new URL("https://pixel-engine-live.vercel.app"),
      alternates: {
        canonical: "https://pixel-engine-live.vercel.app",
      },
      icons: {
        icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🕹️</text></svg>",
      },
      openGraph: {
        title: "Pixel Studio - Retro Creative Sandbox",
        description:
          "Interactive retro pixel art canvas with Conway's Game of Life, falling sand physics, and WebAudio synth.",
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
        title: "Pixel Studio - Retro Creative Sandbox",
        description:
          "Interactive retro pixel art canvas with Conway's Game of Life, falling sand physics, and WebAudio synth.",
        images: ["/pixel_studio_og.png"],
      },
    };
  }

  // Primary Portfolio SEO Metadata
  // TODO: Primary title decision - "Product Designer" vs "Design Engineer". Defaulting to "Product Designer".
  const title = "Aditya Diundi - Product Designer";
  const description =
    "Aditya Diundi is a Product Designer designing evidence-first health systems, AI evaluation benchmarks, and software tools.";
  const url = "https://diundi.space";

  return {
    title,
    description,
    metadataBase: new URL(url),
    alternates: {
      canonical: url,
    },
    icons: {
      icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⟡</text></svg>",
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Aditya Diundi",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Aditya Diundi - Product Designer",
        },
      ],
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Person JSON-LD for rich snippet discovery
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aditya Diundi",
    jobTitle: "Product Designer",
    url: "https://diundi.space",
    sameAs: [
      "https://www.linkedin.com/in/adityadiundi/",
      "https://github.com/AdityaDiundi",
      "https://adityadiundi.bearblog.dev",
    ],
    knowsAbout: [
      "Product Design",
      "Design Engineering",
      "Healthcare UX",
      "Human-Centered AI Benchmarking",
      "Fintech Systems",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-stone-200 dark:selection:bg-stone-800">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
