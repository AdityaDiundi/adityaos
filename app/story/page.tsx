import React from "react";
import { Metadata } from "next";
import { StoryLanding } from "@/components/Story/StoryLanding";
import { getActiveStations, getWritingItems } from "@/content/journey";

export const metadata: Metadata = {
  title: "Journey · Aditya Diwakar",
  description:
    "A scroll-driven 3D story traversal through screens, projects, and the field leading to AdityaOS.",
};

export default async function StoryPage() {
  const stations = getActiveStations();
  const writingItems = await getWritingItems();

  return (
    <main className="w-full min-h-screen bg-[#FAF7F2] dark:bg-[#0E1015]">
      <StoryLanding stations={stations} writingItems={writingItems} />
    </main>
  );
}
