import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work & Project Archive - Aditya Diundi",
  description:
    "Comprehensive archive of product design, systems architecture, and fieldwork projects by Aditya Diundi.",
  alternates: {
    canonical: "https://adityaos-delta.vercel.app/work",
  },
};

interface ArchiveProject {
  title: string;
  client: string;
  year: string;
  role: string;
  tags: string[];
  summary: string;
  metric: string;
  imageSrc?: string;
  imageAlt?: string;
  link?: string;
}

const ARCHIVE_PROJECTS: ArchiveProject[] = [
  {
    title: "Ketto+ Recurring Giving",
    client: "Ketto",
    year: "2024",
    role: "Product Designer",
    tags: ["Fintech Crowdfunding", "Recurring Giving", "Mobile App"],
    summary:
      "Transforming one-off emergency crowdfunding donors into sustained monthly subscribers. Designed the Ketto+ onboarding flow and ambient home screen nudges to establish emotional continuity and transparent impact tracking.",
    metric: "2.3X repeat donor conversion",
    imageSrc: "/case-studies/ketto_curated_flow.png",
    imageAlt: "Ketto+ Mobile App Flow in Figma",
    link: "https://www.figma.com/design/zSSrngf4wlhPPxg0cHlFRE/Ketto-?node-id=29-755",
  },
  {
    title: "Grassroots Fieldwork & Youth Manual",
    client: "Project Potential x India Fellow",
    year: "2023–2024",
    role: "Design Lead & Social Innovator",
    tags: ["Fieldwork Ethnography", "Rural Systems", "Youth Manual"],
    summary:
      "20 months of immersive grassroots fieldwork in rural Rajasthan and Bihar. Conducted ethnographic research across 40+ panchayats and authored the Youth Resource Manual for local community leadership.",
    metric: "20 months field ethnography",
    imageSrc: "/aditya_field_full.jpg",
    imageAlt: "Aditya Diundi Grassroots Fieldwork in Rajasthan",
  },
  {
    title: "Aarohi Bal Sansar: Learnability Lab",
    client: "Aarohi (Uttarakhand)",
    year: "2023",
    role: "Field Researcher & Systems Designer",
    tags: ["Pedagogical Analytics", "Cognitive Matrix", "Himalayan Schools"],
    summary:
      "Designed a non-verbal 4-vector cognitive diagnostic framework (pattern, logic, spatial, linguistic) to evaluate aptitude in first-generation Himalayan rural learners without English language bias.",
    metric: "100+ students evaluated across 4 cognitive vectors",
    imageSrc: "/case-studies/janeval_evidence.png",
    imageAlt: "Aarohi Bal Sansar Learnability Diagnostic Matrix",
  },
  {
    title: "Tutedude Course Architecture & Onboarding",
    client: "Tutedude",
    year: "2022",
    role: "UI/UX Designer",
    tags: ["EdTech", "Onboarding", "Course Navigation"],
    summary:
      "Redesigned course selection and onboarding flows for an emerging Indian EdTech platform, replacing scattered lesson catalogs with guided skill paths.",
    metric: "Interactive enrollment flow across 15+ disciplines",
  },
];

export default function WorkArchivePage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0c0d10] text-stone-900 dark:text-stone-100 px-6 sm:px-8 py-12 sm:py-20 transition-colors">
      <main className="max-w-[700px] mx-auto space-y-12">
        <nav aria-label="Breadcrumb">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to portfolio</span>
          </Link>
        </nav>

        <header className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Work Archive
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-base leading-relaxed">
            Additional shipped projects, design consultations, and field research initiatives.
          </p>
        </header>

        <div className="space-y-10">
          {ARCHIVE_PROJECTS.map((project, idx) => (
            <article
              key={idx}
              className="border-b border-stone-200 dark:border-stone-800 pb-10 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs text-stone-500 dark:text-stone-400 font-mono">
                <div>
                  <span className="text-stone-900 dark:text-stone-200 font-semibold">
                    {project.client}
                  </span>
                  <span> · {project.role}</span>
                  <span> · {project.year}</span>
                </div>
                <div>{project.tags.join(", ")}</div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-teal-700 dark:hover:text-teal-400 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <span>{project.title}</span>
                  )}
                </h2>
                <p className="text-stone-700 dark:text-stone-300 text-base leading-relaxed">
                  {project.summary}
                </p>
              </div>

              {project.imageSrc && (
                <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <Image
                    src={project.imageSrc}
                    alt={project.imageAlt || project.title}
                    fill
                    sizes="(max-width: 960px) 100vw, 960px"
                    className="object-cover object-top"
                  />
                </div>
              )}

              <div className="text-xs font-mono text-stone-600 dark:text-stone-400">
                Key Result: <span className="font-semibold text-stone-900 dark:text-stone-200">{project.metric}</span>
              </div>
            </article>
          ))}
        </div>

        <footer className="border-t border-stone-200 dark:border-stone-800 pt-6">
          <Link
            href="/#work"
            className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to selected work</span>
          </Link>
        </footer>
      </main>
    </div>
  );
}
