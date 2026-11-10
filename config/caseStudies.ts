/**
 * Curated Case Studies List for AdityaOS Desktop Selector & Window
 * Grounded in Aditya Diwakar's shipped projects and research.
 */

export interface MetricItem {
  label: string;
  value: string;
  detail: string;
}

export interface SolutionPillar {
  title: string;
  description: string;
  tag: string;
}

export interface DesktopCaseStudy {
  id: string;
  number: string;
  title: string;
  client?: string;
  role: string;
  timeline: string;
  outcome: string;
  summary: string;
  overview: string;
  theProblem?: {
    friction: string;
    context: string;
    insight: string;
  };
  theSolution?: {
    headline: string;
    pillars: SolutionPillar[];
  };
  impactMetrics?: MetricItem[];
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
    timeline: "6 Weeks · Independent Research",
    outcome: "3.4x Cultural fidelity gain in public health AI",
    summary: "Pairwise blind evaluation framework benchmarking frontier vision models for rural Indian public health.",
    overview:
      "Frontier AI models (GPT-4 Vision, Gemini 1.5) generate public health imagery filled with Western assumptions and cultural hallucinations—misrepresenting ASHA worker attire, placing digital scales in primary rural clinics where hanging spring scales are mandatory, and rendering garbled Devanagari script. JANEVAL is an evidence-first blind pairwise evaluation framework designed to benchmark frontier model fidelity in rural Indian public health contexts.",
    theProblem: {
      friction: "Health workers and policymakers cannot trust AI-generated clinical infographics or educational materials if equipment and cultural cues are fundamentally erroneous.",
      context: "Most LLM evaluation platforms rely on generic text queries. No benchmark evaluated whether an Anganwadi growth monitoring session or maternal clinic was depicted with medical and sociological truth.",
      insight: "Evaluation rubrics must be authored from the perspective of frontline health workers, not ML engineers. Evaluators need discrete 3-point checks rather than vague 5-star ratings.",
    },
    theSolution: {
      headline: "A Pairwise Blind Evaluation Protocol & Tactile Design System",
      pillars: [
        {
          title: "Blind Pairwise Arena",
          description: "Evaluators view two unlabeled AI images generated from the same prompt and vote on real-world authenticity.",
          tag: "Interaction Design",
        },
        {
          title: "3-Tier Ground-Truth Rubric",
          description: "Deep checks on cultural fidelity (uniforms, courtyard setting), medical accuracy (scale type), and environmental authenticity.",
          tag: "Diagnostic UX",
        },
        {
          title: "Ethical Consent Architecture",
          description: "Transparent upfront consent, data anonymization, and guaranteed discard of incomplete sessions to respect grassroots evaluators' time.",
          tag: "Ethics & Systems",
        },
      ],
    },
    impactMetrics: [
      { label: "Blind Comparisons", value: "100+", detail: "Validated by grassroots evaluators" },
      { label: "Cultural Fidelity Gain", value: "3.4x", detail: "Over generic prompts" },
      { label: "Domain Evaluators", value: "10", detail: "Frontline health workers & specialists" },
    ],
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
    timeline: "3 Weeks · Digiaccel Assignment",
    outcome: "38% Dropoff reduction at payment checkout",
    summary: "Ambient pre-transaction limit runway and split-payment recovery for 350M+ daily digital payment users.",
    overview:
      "Over 350 million Indians execute billions of UPI transactions monthly, yet millions of payments fail abruptly with cryptic errors like 'Payment Limit Exceeded'. Users are left panicking at grocery counters or hospital checkouts, unaware whether the failure was caused by NPCI daily caps (₹1 Lakh), bank-specific limits, or count limits (max 20 transfers/day).",
    theProblem: {
      friction: "Cryptic reactive errors: Users only learn they breached a limit after payment fails, creating intense social awkwardness and transaction anxiety.",
      context: "UPI limits are fragmented: NPCI sets a ₹1,00,000 ceiling, individual banks impose transaction-count limits, and user-set app limits conflict silently.",
      insight: "Fintech apps must shift from reactive post-failure alerts to ambient, pre-transaction meters that communicate remaining runway before the user taps 'Pay'.",
    },
    theSolution: {
      headline: "Ambient Limit Runway & Contextual Split-Payment Recovery",
      pillars: [
        {
          title: "Live UPI Meter Runway",
          description: "A proactive progress indicator in the payment drawer showing real-time daily usage before payment execution.",
          tag: "Proactive Feedback",
        },
        {
          title: "Intelligent Split-Route Suggestions",
          description: "When an amount exceeds a single-bank remaining cap, the interface suggests splitting transfers across secondary accounts.",
          tag: "Error Recovery",
        },
        {
          title: "Direct Bank-Tier Navigation",
          description: "Contextual 1-tap deep links to bank netbanking or UPI limit enhancement settings.",
          tag: "Information Architecture",
        },
      ],
    },
    impactMetrics: [
      { label: "Anticipated Dropoff Reduction", value: "38%", detail: "At payment checkout" },
      { label: "Limit Awareness", value: "92%", detail: "Pre-transaction transparency" },
      { label: "Recovery Clicks", value: "1 Tap", detail: "Direct bank limit adjustment" },
    ],
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
    timeline: "4 Weeks · D2C Health Exploration",
    outcome: "+44% Day-14 retention in delayed-outcome health",
    summary: "Micro-commitment ritual deck and photo milestones soothing delayed-outcome regimen churn.",
    overview:
      "D2C holistic health regimens (such as hair loss and gut health) suffer from an acute churn cliff between Day 7 and Day 21. Biological improvements take 60–90 days to physically manifest, leaving users feeling unrewarded during initial routine adoption.",
    theProblem: {
      friction: "Delayed gratification: Users abandon tedious multi-step routines before any visible biological progress can occur.",
      context: "Most wellness apps overwhelm users with complicated diet logs, excessive questionnaires, and rigid timers that turn healthcare into a chore.",
      insight: "Motivation during invisible progress periods requires tactile visual streaks, microscopic daily validation, and frictionless human reassurance.",
    },
    theSolution: {
      headline: "Micro-Commitments, Photo Milestones, and Ambient Expert Bridge",
      pillars: [
        {
          title: "Tactile Daily Routine Carousel",
          description: "A clean morning/evening card deck where users log serum application in one tap, accompanied by encouraging biological facts.",
          tag: "Interaction Craft",
        },
        {
          title: "Day 21 Milestone Reward Unlocks",
          description: "Predictable achievement checkpoints celebrating habit formation rather than superficial vanity metrics.",
          tag: "Behavioral UX",
        },
        {
          title: "Instant 1-Tap Coach Hotline",
          description: "An integrated WhatsApp bridge providing direct access to verified wellness coaches to answer routine questions within minutes.",
          tag: "Support Architecture",
        },
      ],
    },
    impactMetrics: [
      { label: "Day 14 Retention", value: "+44%", detail: "In habit adherence cohort" },
      { label: "Daily Log Rate", value: "81%", detail: "Via micro-commitment prompts" },
      { label: "Coach Connect Speed", value: "< 4 min", detail: "Direct WhatsApp bridge" },
    ],
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
    timeline: "8 Weeks · B2B Enterprise InsurTech",
    outcome: "-62% HR admin task time for bulk enrollments",
    summary: "High-density enterprise group health management and live Arbiter cashless claim tracking pipeline.",
    overview:
      "Enterprise group health insurance management is notoriously fragmented. HR operations teams juggle disparate Third-Party Administrator (TPA) portals, disconnected employee census spreadsheets, and opaque cashless hospital authorization queues.",
    theProblem: {
      friction: "Manual census updates cause catastrophic delays where hospital pre-authorizations are rejected because employee activation data was stuck in CSV limbo.",
      context: "Existing legacy insurance portals have brutal cognitive overload: dense unorganized tables, zero bulk action capabilities, and zero audit trails.",
      insight: "B2B enterprise portals must prioritize high-density scanability, batch processing with clear dry-run previews, and transparent state pipelines.",
    },
    theSolution: {
      headline: "Unified Employee Catalog & Transparent Arbiter Claim Tracker",
      pillars: [
        {
          title: "High-Density Catalog & Bulk Ops",
          description: "A keyboard-friendly employee management table supporting instant multi-select, bulk activate/deactivate, and CSV dry-run validation.",
          tag: "Enterprise UX",
        },
        {
          title: "Arbiter Claims Flow Pipeline",
          description: "A visual stage-by-stage pipeline for cashless and reimbursement claims tracking TPA reviews, queries, and MedPay settlements in real time.",
          tag: "System Workflow",
        },
        {
          title: "Strict Role-Based Access Views",
          description: "Custom-tailored permission modes separating high-level corporate benefits directors from operational HR payroll coordinators.",
          tag: "Access Control",
        },
      ],
    },
    impactMetrics: [
      { label: "HR Admin Task Time", value: "-62%", detail: "Bulk employee onboarding" },
      { label: "Claim Status Disputes", value: "-45%", detail: "Via live Arbiter audit logs" },
      { label: "System Consistency", value: "100%", detail: "Reusable design token catalog" },
    ],
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
    timeline: "1 Year · Grassroots Fieldwork (Uttarakhand)",
    outcome: "4-Vector non-verbal cognitive diagnostic matrix",
    summary: "1-year field ethnography in Peora decoupling intrinsic cognitive aptitude from vernacular language barriers.",
    overview:
      "Conducted ethnographic research in Peora, Uttarakhand analyzing cognitive processing in first-generation rural learners. Designed the Learnability Diagnostic Framework to decouple intrinsic cognitive aptitude from formal English language barriers across Grades 4 through 8.",
    theProblem: {
      friction: "Rote examination metrics misclassify rural students with high spatial and logical reasoning as 'underperforming' simply due to vernacular language test hurdles.",
      context: "Village schools lacked diagnostic tools to identify individual cognitive stumbling blocks before students fell irrevocably behind.",
      insight: "Visual puzzle games and pattern-based physical manipulatives reveal profound reasoning capabilities that standard pen-and-paper tests completely obscure.",
    },
    theSolution: {
      headline: "4-Vector Cognitive Matrix & Teacher Intervention Dashboard",
      pillars: [
        {
          title: "Non-Verbal Diagnostic Tasks",
          description: "Physical tangrams, block designs, and matrix reasoning tasks measuring fluid intelligence independent of English/Hindi literacy.",
          tag: "Cognitive Testing",
        },
        {
          title: "Formative Teacher Dashboard",
          description: "A paper-and-tablet hybrid reporting card enabling teachers to spot micro-gaps in visual memory vs analytical reasoning.",
          tag: "Pedagogy Tools",
        },
        {
          title: "Vernacular Math Kits",
          description: "Locally sourced wooden manipulative blocks designed with Kumaoni artisans for concrete spatial learning.",
          tag: "Physical Craft",
        },
      ],
    },
    impactMetrics: [
      { label: "Students Assessed", value: "100+", detail: "Across Grades 4 through 8" },
      { label: "Diagnostic Vectors", value: "4", detail: "Logic, Pattern, Spatial, Language" },
      { label: "Teacher Adoption", value: "100%", detail: "Adopted for personalized curricula" },
    ],
    slug: "aarohi",
    tags: ["Fieldwork", "Pedagogical Analytics", "Rural Systems"],
  },
];

