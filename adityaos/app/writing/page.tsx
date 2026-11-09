import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing & Field Essays - Aditya Diundi",
  description:
    "Essays on rural leadership, cognitive ethnography, digital culture, and personal reflections by Aditya Diundi.",
  alternates: {
    canonical: "https://adityaos-delta.vercel.app/writing",
  },
};

interface EssayItem {
  id: string;
  title: string;
  venue: string;
  year: string;
  readTime: string;
  excerpt: string;
  url?: string;
}

const ALL_WRITING: EssayItem[] = [
  {
    id: "identity-in-youth-clubs-in-india",
    title: "Identity In Youth Clubs In India",
    venue: "India Fellow",
    year: "2024",
    readTime: "6 min read",
    excerpt:
      "Examining collective identity formation, youth empowerment networks, and active citizenship across panchayats in rural Bihar.",
    url: "https://indiafellow.org/blog/all-posts/identity-in-youth-clubs-in-india/",
  },
  {
    id: "motivation-in-rural-leadership-programs",
    title: "Motivation In Rural Leadership Programs",
    venue: "India Fellow",
    year: "2024",
    readTime: "5 min read",
    excerpt:
      "Understanding intrinsic motivation drivers prompting rural youth to participate in unventilated 39°C community spaces.",
    url: "https://indiafellow.org/blog/all-posts/motivation-in-rural-leadership-programs/",
  },
  {
    id: "balancing-act-rajasthan-water-crisis",
    title: "Balancing Act: Navigating Choices In Rural Rajasthan's Water Crisis",
    venue: "India Fellow",
    year: "2024",
    readTime: "8 min read",
    excerpt:
      "First-person ethnography documenting groundwater depletion, fluoride contamination, and the resilience of rural families in Jaipur.",
    url: "https://indiafellow.org/blog/all-posts/balancing-act-navigating-choices-in-rural-rajasthans-water-crisis/",
  },
  {
    id: "questions-for-self-discovery",
    title: "Questions For Self-Discovery From A Human Process Lab",
    venue: "India Fellow",
    year: "2024",
    readTime: "6 min read",
    excerpt:
      "Key introspective reflections from the ISABS Basic Human Process Lab at Sevagram, exploring interpersonal dynamics and self-awareness.",
    url: "https://indiafellow.org/blog/all-posts/questions-for-self-discovery-from-a-human-process-lab/",
  },
  {
    id: "youth-masterpiece-collaboration-art",
    title: "Youth Masterpiece: Fostering Collaboration Through Art",
    venue: "India Fellow",
    year: "2024",
    readTime: "4 min read",
    excerpt:
      "Designing experiential midline activities in the Youth Resource Manual to build teamwork, communication, and creative confidence.",
    url: "https://indiafellow.org/blog/all-posts/youth-masterpiece-fostering-collaboration-through-art/",
  },
  {
    id: "online-gaming-india-toxic",
    title: "Why Online Gaming in India Feels So Toxic",
    venue: "Medium",
    year: "2024",
    readTime: "6 min read",
    excerpt:
      "A cultural exploration of language limits, emotional articulation, and normalized hostility inside Indian competitive multiplayer lobbies.",
    url: "https://adityadiundi.medium.com/why-online-gaming-in-india-feels-so-toxic-1d506b87acf8",
  },
  {
    id: "home-brewing-style",
    title: "Home Brewing in Style",
    venue: "Medium",
    year: "2024",
    readTime: "4 min read",
    excerpt:
      "A deep dive into microbrewing, craft techniques, and design showcases for niche personal brewing workflows.",
    url: "https://adityadiundi.medium.com/home-brewing-in-style-6fcdaff414b5",
  },
  {
    id: "on-borrowed-beliefs",
    title: "On Borrowed Beliefs",
    venue: "Personal Essay",
    year: "2024",
    readTime: "4 min read",
    excerpt:
      "Investigating the cognitive cost of unexamined dogma, inherited social defaults, and the slow reclamation of epistemic agency.",
  },
  {
    id: "daughters-of-misogyny",
    title: "Daughters of Misogyny",
    venue: "Personal Reflection",
    year: "2024",
    readTime: "3 min read",
    excerpt:
      "A systemic exploration of generational conditioning, silent domestic hierarchies, and how structural misogyny replicates across rural familial nodes.",
  },
  {
    id: "ganje-logon-ki-panchayat",
    title: "गंजे लोगों की पंचायत",
    venue: "India Fellow",
    year: "2025",
    readTime: "3 min read",
    excerpt:
      "पारिवारिक बैठकों, उम्र के तकाजों और सामाजिक संकोचों पर व्यंग्यात्मक काव्य और आत्मस्वीकृति का अनूठा मेल।",
    url: "https://indiafellow.org/blog/all-posts/%e0%a4%97%e0%a4%82%e0%a4%9c%e0%a5%87-%e0%a4%b2%e0%a5%8b%e0%a4%97%e0%a5%8b%e0%a4%82-%e0%a4%95%e0%a5%80-%e0%a4%aa%e0%a4%82%e0%a4%9a%e0%a4%be%e0%a4%af%e0%a4%a4/",
  },
];

export default function WritingArchivePage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0c0d10] text-stone-900 dark:text-stone-100 px-6 sm:px-8 py-12 sm:py-20 transition-colors">
      <main className="max-w-[700px] mx-auto space-y-12">
        <nav aria-label="Breadcrumb">
          <Link
            href="/#writing"
            className="inline-flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to portfolio</span>
          </Link>
        </nav>

        <header className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Writing Archive
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-base leading-relaxed">
            Essays, field journals, cultural analyses, and personal notes authored between 2023 and 2025.
          </p>
        </header>

        <ul className="divide-y divide-stone-200 dark:divide-stone-800">
          {ALL_WRITING.map((essay) => (
            <li key={essay.id} className="py-6 space-y-2 group">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {essay.url ? (
                    <a
                      href={essay.url}
                      target={essay.url.startsWith("http") ? "_blank" : undefined}
                      rel={essay.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="hover:text-teal-700 dark:hover:text-teal-400 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{essay.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <span>{essay.title}</span>
                  )}
                </h2>
                <div className="text-xs text-stone-500 dark:text-stone-400 font-mono flex items-center gap-2 flex-shrink-0">
                  <span>{essay.venue}</span>
                  <span>·</span>
                  <span>{essay.year}</span>
                </div>
              </div>

              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                {essay.excerpt}
              </p>
            </li>
          ))}
        </ul>

        <footer className="border-t border-stone-200 dark:border-stone-800 pt-6">
          <Link
            href="/#writing"
            className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to portfolio</span>
          </Link>
        </footer>
      </main>
    </div>
  );
}
