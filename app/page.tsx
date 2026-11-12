"use client";

import React from "react";
import { AdityaOSDesktop } from "@/components/System/AdityaOSDesktop";
import { StoryLanding } from "@/components/Story/StoryLanding";

export default function Home({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  if (searchParams?.mode === "story") {
    const defaultApp = typeof searchParams?.app === "string" ? searchParams.app : undefined;
    return <StoryLanding defaultAppOnLanding={defaultApp} />;
  }

  const initialMode = searchParams?.mode === "os" ? "os" : "portfolio";
  const defaultApp = typeof searchParams?.app === "string" ? searchParams.app : undefined;

  return <AdityaOSDesktop initialViewMode={initialMode} defaultApp={defaultApp} />;
}

