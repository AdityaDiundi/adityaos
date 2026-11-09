"use client";

import React from "react";
import { AdityaOSDesktop } from "@/components/System/AdityaOSDesktop";

export default function Home({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const initialMode = searchParams?.mode === "os" ? "os" : "portfolio";
  const defaultApp = typeof searchParams?.app === "string" ? searchParams.app : undefined;

  return <AdityaOSDesktop initialViewMode={initialMode} defaultApp={defaultApp} />;
}
