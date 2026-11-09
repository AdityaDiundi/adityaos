import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface WorkCardProps {
  id: string;
  title: string;
  client?: string;
  year: string;
  role: string;
  tags: string[];
  summary: string;
  metric: {
    value: string;
    label: string;
  };
  imageSrc: string;
  imageAlt: string;
  caseStudyUrl: string;
  liveUrl?: string;
  priority?: boolean;
}

export function WorkCard({
  id,
  title,
  client,
  year,
  role,
  tags,
  summary,
  metric,
  imageSrc,
  imageAlt,
  caseStudyUrl,
  liveUrl,
  priority = false,
}: WorkCardProps) {
  return (
    <article className="border-t border-stone-200 dark:border-stone-800 pt-10 pb-16 space-y-6">
      {/* Meta Row: Role, Client, Year, Plain comma-separated tags */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-sm text-stone-500 dark:text-stone-400">
        <div>
          <span className="font-medium text-stone-900 dark:text-stone-200">
            {role}
          </span>
          {client && (
            <span>
              {" "}
              · <span className="text-stone-600 dark:text-stone-400">{client}</span>
            </span>
          )}
          <span> · {year}</span>
        </div>
        <div className="text-xs text-stone-500 dark:text-stone-400">
          {tags.join(", ")}
        </div>
      </div>

      {/* Title & One-line summary */}
      <div className="space-y-2 max-w-[700px]">
        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
          <Link
            href={caseStudyUrl}
            className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors inline-flex items-center gap-1.5 group"
          >
            <span>{title}</span>
            <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </Link>
        </h3>
        <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed">
          {summary}
        </p>
      </div>

      {/* Responsive Visual — No mock browser/macOS chrome, max-w-960px */}
      <div className="pt-2">
        <Link
          href={caseStudyUrl}
          aria-label={`Read case study: ${title}`}
          className="block relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 transition-opacity hover:opacity-95"
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 960px) 100vw, 960px"
            priority={priority}
            className="object-cover object-top"
          />
        </Link>
      </div>

      {/* Metric & Direct Action Links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-sm">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-stone-900 dark:text-stone-100 font-mono text-base">
            {metric.value}
          </span>
          <span className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
            {metric.label}
          </span>
        </div>

        <div className="flex items-center gap-5 font-medium text-xs sm:text-sm">
          <Link
            href={caseStudyUrl}
            className="text-stone-900 dark:text-stone-100 underline underline-offset-4 decoration-stone-300 dark:decoration-stone-700 hover:decoration-stone-900 dark:hover:decoration-stone-100 transition-colors"
          >
            Read case study →
          </Link>
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors inline-flex items-center gap-1"
            >
              <span>Live prototype</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
