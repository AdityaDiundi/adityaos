export interface CaseStudy {
  id: string;
  number: string;
  title: string;
  tagline: string;
  category: "AI & Public Health" | "Fintech & Payments" | "D2C HealthTech" | "Enterprise SaaS" | "Pedagogical Analytics";
  year: string;
  timeline: string;
  role: string;
  impactMetrics: { label: string; value: string; detail?: string }[];
  accentColor: string;
  accentGlow: string;
  badge: string;
  overview: string;
  theProblem: {
    friction: string;
    context: string;
    insight: string;
  };
  theSolution: {
    headline: string;
    pillars: { title: string; description: string; tag: string }[];
  };
  designSystemTokens?: {
    canvas?: string;
    primary?: string;
    accent?: string;
    border?: string;
  };
  figmaUrl?: string;
  previewType: "janeval_eval" | "upi_meter" | "hair_tracker" | "claims_portal" | "learnability_matrix";
}

export interface EssayItem {
  id: string;
  title: string;
  category: "Essay" | "Poem" | "Dispatch";
  source: string;
  readTime: string;
  year: string;
  excerpt: string;
  url: string;
  theme: string;
  content?: string[];
}

export interface LearnabilityMetric {
  category: string;
  sampleSize: number;
  baseline: string;
  postIntervention: string;
  insight: string;
}
