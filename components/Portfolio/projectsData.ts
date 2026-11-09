export interface ProjectSpec {
  id: string;
  number: string;
  title: string;
  client: string;
  year: string;
  role: string;
  timeline: string;
  stack: string[];
  metricNumber: string;
  metricLabel: string;
  metricDetail?: string;
  summary: string;
  liveUrl?: string;
  caseStudyUrl: string;
  sectionId: string;
}

export const SHIPPED_PROJECTS: ProjectSpec[] = [
  {
    id: "janeval",
    number: "01",
    title: "JANEVAL Benchmark",
    client: "Independent Research",
    year: "2024",
    role: "Lead Product Designer & Systems Architect",
    timeline: "6 Weeks",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Elo Arena"],
    metricNumber: "3.4x",
    metricLabel: "Cultural Fidelity Lift",
    metricDetail: "Frontline health worker validation",
    summary: "Frontier AI medical evaluation framework for rural Indian healthcare with blind pairwise Elo arena.",
    liveUrl: "https://janeval.vercel.app/",
    caseStudyUrl: "/work/janeval",
    sectionId: "project-janeval",
  },
  {
    id: "adityaos",
    number: "02",
    title: "AdityaOS Pixel Studio",
    client: "Personal System",
    year: "2024",
    role: "Systems Engineer & Design Technologist",
    timeline: "8 Weeks",
    stack: ["HTML5 Canvas 2D", "Web Audio API", "Cellular Automata", "TypeScript", "React"],
    metricNumber: "60 FPS",
    metricLabel: "Deterministic Canvas",
    metricDetail: "Zero-dependency procedural physics",
    summary: "In-browser retro operating system and deterministic pixel engine with Conway's Game of Life.",
    liveUrl: "https://aditya-os.live",
    caseStudyUrl: "/work/adityaos",
    sectionId: "project-adityaos",
  },
  {
    id: "mfine",
    number: "03",
    title: "MFine Claims Console",
    client: "MFine",
    year: "2022—2023",
    role: "Product Designer (InsurTech Systems)",
    timeline: "10 Months",
    stack: ["Figma Design Tokens", "B2B Admin Console", "InsurTech", "Cashless OPD"],
    metricNumber: "100K+",
    metricLabel: "DAU · <15m Approvals",
    metricDetail: "85% reduction in pre-auth latency",
    summary: "Unified B2B healthcare benefits console and enterprise cashless claim pre-authorization pipeline.",
    caseStudyUrl: "/work/mfine",
    sectionId: "project-mfine",
  },
  {
    id: "digiaccel",
    number: "04",
    title: "UPI Limit Clarity",
    client: "Digiaccel",
    year: "2023",
    role: "Product Designer (Fintech UX)",
    timeline: "3 Weeks",
    stack: ["Fintech UX", "UPI Payments", "Ambient Feedback", "Error Recovery"],
    metricNumber: "-38%",
    metricLabel: "Checkout Drop-Offs",
    metricDetail: "Ambient limit runway & 1-tap failover",
    summary: "Ambient UPI spend runway and proactive error recovery eliminating cryptic checkout failures.",
    caseStudyUrl: "/work/digiaccel",
    sectionId: "project-digiaccel",
  },
  {
    id: "mosaic",
    number: "05",
    title: "Mosaic Habit Engine",
    client: "Mosaic Wellness (ManMatters)",
    year: "2023",
    role: "Product Designer & Behavioral Researcher",
    timeline: "4 Weeks",
    stack: ["HealthTech D2C", "Habit Loops", "Behavioral UX", "Regimen Adherence"],
    metricNumber: "+12%",
    metricLabel: "Cohort Retention Lift",
    metricDetail: "21-day milestone streak mechanics",
    summary: "Behavioral retention engine for delayed-gratification health regimens with WhatsApp check-ins.",
    caseStudyUrl: "/work/mosaic",
    sectionId: "project-mosaic",
  },
  {
    id: "ketto",
    number: "06",
    title: "Ketto Crowdfunding",
    client: "Ketto",
    year: "2023",
    role: "UI/UX Designer (Growth & Payments)",
    timeline: "8 Months",
    stack: ["Fintech Philanthropy", "Recurring Mandates", "Trust Architecture", "UPI Autopay"],
    metricNumber: "2.3x",
    metricLabel: "Repeat Giving Lift",
    metricDetail: "UPI Autopay micro-mandates",
    summary: "Recurring medical crowdfunding and transparent patient recovery milestone architecture.",
    caseStudyUrl: "/work/ketto",
    sectionId: "project-ketto",
  },
  {
    id: "tutedude",
    number: "07",
    title: "TuteDude Mentorship",
    client: "TuteDude",
    year: "2023",
    role: "Product Designer (Learning Systems)",
    timeline: "5 Weeks",
    stack: ["EdTech", "Interactive Video", "Mentorship Queue", "Gamified Runway"],
    metricNumber: "+34%",
    metricLabel: "Completion Rate",
    metricDetail: "<3m live mentor triage queue",
    summary: "Interactive video lecture player with embedded sub-3-minute 1-on-1 mentor triage queues.",
    caseStudyUrl: "/work/tutedude",
    sectionId: "project-tutedude",
  },
];
