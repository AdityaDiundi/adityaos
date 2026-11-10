/**
 * Curated Case Studies List for AdityaOS Desktop Selector & Window
 * Grounded in Aditya Diwakar's shipped projects and research.
 */

export interface DesktopCaseStudy {
  id: string;
  number: string;
  title: string;
  client?: string;
  role: string;
  outcome: string;
  summary: string;
  slug: string;
  figmaUrl?: string;
  liveUrl?: string;
  tags: string[];
}

export const DESKTOP_CASE_STUDIES: DesktopCaseStudy[] = [
  {
    id: "janeval",
    number: "01",
    title: "JANEVAL",
    client: "Josh Talks",
    role: "Lead Product Designer & Systems Architect",
    outcome: "3.4x Cultural fidelity gain in public health AI",
    summary: "Pairwise blind evaluation framework benchmarking frontier vision models for rural Indian public health.",
    slug: "janeval",
    liveUrl: "https://janeval.vercel.app/",
    figmaUrl: "https://www.figma.com/design/zSSrngf4wlhPPxg0cHlFRE/Ketto-",
    tags: ["AI Benchmark", "Public Health", "Evaluation UX"],
  },
  {
    id: "upi-limit-clarity",
    number: "02",
    title: "UPI Limit Clarity",
    client: "Digiaccel",
    role: "Product Designer (Fintech UX)",
    outcome: "38% Anticipated dropoff reduction at checkout",
    summary: "Ambient pre-transaction limit runway and split-payment recovery for 350M+ daily digital payment users.",
    slug: "digiaccel",
    figmaUrl: "https://www.figma.com/design/zCmxQ3KwFy0mhlFbtlApua/UPI-Limit-Clarity---digiaccel-Assignment?node-id=0-1",
    tags: ["Fintech", "Payment Limits", "Error Recovery"],
  },
  {
    id: "hair-tracker",
    number: "03",
    title: "21-Day Habit Tracker",
    client: "Mosaic Wellness",
    role: "UX Researcher & Product Designer",
    outcome: "+44% Day-14 retention in delayed-outcome health",
    summary: "Micro-commitment ritual deck and photo milestones soothing delayed-outcome regimen churn.",
    slug: "mosaic",
    figmaUrl: "https://www.figma.com/design/jYWIU8kR4JiRbQU6UcctXm/21-Day-Hair-Tracker?node-id=0-1",
    tags: ["D2C HealthTech", "Behavioral Retention", "Habits"],
  },
  {
    id: "corporate-claims",
    number: "04",
    title: "Corporate Claims (S3)",
    client: "MFine Healthcare",
    role: "Product Designer & Design Systems Lead",
    outcome: "-62% HR admin task time for bulk enrollments",
    summary: "High-density enterprise group health management and live Arbiter cashless claim tracking pipeline.",
    slug: "mfine",
    figmaUrl: "https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211",
    tags: ["Enterprise SaaS", "InsurTech", "Design Systems"],
  },
  {
    id: "aarohi-lab",
    number: "05",
    title: "Aarohi Learnability Lab",
    client: "Aarohi (Uttarakhand)",
    role: "Field Researcher & Systems Designer",
    outcome: "4-Vector non-verbal cognitive diagnostic matrix",
    summary: "1-year field ethnography in Peora decoupling intrinsic cognitive aptitude from vernacular language barriers.",
    slug: "aarohi",
    tags: ["Fieldwork", "Pedagogical Analytics", "Rural Systems"],
  },
];
