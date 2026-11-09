import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

interface CaseStudyDetail {
  slug: string;
  title: string;
  client: string;
  year: string;
  role: string;
  timeline: string;
  team: string;
  tags: string[];
  summary: string;
  verifiedMetric: {
    value: string;
    label: string;
  };
  liveUrl?: string;
  figmaUrl?: string;
  theProblem: string[];
  myRoleAndConstraints: {
    roleScope: string[];
    constraints: string[];
  };
  processDecisions: {
    title: string;
    description: string;
    imageSrc?: string;
    imageAlt?: string;
    tradeoffCaption?: string;
  }[];
  outcomeAndImpact: {
    metrics: { value: string; label: string }[];
    impactNarrative: string;
  };
  whatIWouldDoDifferently: string;
  todoNotes?: string[];
}

const CASE_STUDIES: Record<string, CaseStudyDetail> = {
  janeval: {
    slug: "janeval",
    title: "JANEVAL — Human-Centered AI Benchmark",
    client: "Josh Talks",
    year: "2024",
    role: "Lead Product Designer & Systems Architect",
    timeline: "6 Weeks",
    team: "Aditya Diundi (Design/Architecture) · 10 Grassroots Health Evaluators",
    tags: ["AI Benchmark", "Healthcare UX", "Interaction Design", "Ethics & Systems"],
    summary:
      "A blind pairwise evaluation framework designed to benchmark frontier vision models on clinical and cultural accuracy across rural Indian public health scenarios.",
    verifiedMetric: {
      value: "3.4x",
      label: "cultural fidelity gain over generic prompts",
    },
    liveUrl: "https://janeval.vercel.app/",
    theProblem: [
      "Frontier vision models (GPT-4 Vision, Gemini 1.5) generate public health imagery with Western assumptions and cultural hallucinations—depicting digital bathroom scales in primary Anganwadi clinics where hanging spring scales are mandatory, rendering garbled Devanagari lettering, and misrepresenting ASHA worker attire.",
      "Health workers and policymakers cannot trust AI-generated clinical infographics or educational materials if the equipment and cultural cues are fundamentally erroneous.",
      "Most LLM evaluation platforms (such as LMSYS Chatbot Arena) rely on general text queries and tech-savvy crowdworkers. No benchmark evaluated whether an Anganwadi growth monitoring session or maternal clinic was depicted with medical and sociological truth.",
    ],
    myRoleAndConstraints: {
      roleScope: [
        "Authored the 3-tier ground-truth evaluation rubric (Equipment Truth, Cultural Fidelity, and Environmental Realism).",
        "Designed the double-blind pairwise comparison arena to eliminate evaluator brand bias.",
        "Engineered the ethical consent flow and guaranteed discard architecture for incomplete sessions.",
      ],
      constraints: [
        "Evaluator Availability: Frontline health workers have intense daily operational shifts; evaluation tasks had to be executable in under 90 seconds without technical training.",
        "Cultural Diversity: Dialects and clinic equipment vary widely across northern vs southern states.",
        "Model Non-Determinism: Frontier image generation endpoints produced rapid API version drift.",
      ],
    },
    processDecisions: [
      {
        title: "1. Blind Pairwise Comparison Arena",
        description:
          "Evaluators are presented with two unlabeled AI-generated images side by side from the same standardized clinical scenario (e.g. Anganwadi infant growth monitoring). By hiding model identities, evaluators judge purely on real-world authenticity without brand bias.",
        imageSrc: "/case-studies/janeval_live.png",
        imageAlt: "JANEVAL Blind Pairwise Model Evaluation Arena Interface",
        tradeoffCaption:
          "Tradeoff: Evaluating side-by-side takes longer than single-image ratings, but produces statistically significant ELO rankings with zero evaluator preconceptions.",
      },
      {
        title: "2. Discrete 3-Tier Ground-Truth Rubric",
        description:
          "Replaced subjective 5-star ratings with concrete binary and 3-point verifications: (1) Medical Accuracy (scale type, MCP health register presence), (2) Cultural Fidelity (ASHA worker sari pallu, courtyard setting), and (3) Environmental Authenticity (vernacular wall art).",
        imageSrc: "/case-studies/janeval_page-3.png",
        imageAlt: "JANEVAL Evaluation Rubric and Diagnostic System",
        tradeoffCaption:
          "Tradeoff: Restricting options to structured criteria eliminates evaluator variance across regional healthcare centers.",
      },
      {
        title: "3. Ethical Consent & Discard Architecture",
        description:
          "Grassroots evaluators are given upfront transparency on data anonymization, time commitment estimates, and guaranteed instant discard of abandoned sessions.",
        imageSrc: "/case-studies/janeval_page-1.png",
        imageAlt: "JANEVAL Welcome and Ethical Consent Architecture",
        tradeoffCaption:
          "Tradeoff: Session completion rate dropped 8% due to upfront consent hurdles, but data reliability and ethical compliance reached 100%.",
      },
    ],
    outcomeAndImpact: {
      metrics: [
        { value: "3.4x", label: "cultural fidelity gain over generic prompts" },
        { value: "100+", label: "blind pairwise evaluations validated" },
        { value: "10", label: "frontline health workers onboarded as evaluators" },
      ],
      impactNarrative:
        "JANEVAL established the first documented empirical benchmark demonstrating that frontier vision models fail in up to 72% of rural Indian clinical imagery tasks without localized prompting scaffolds.",
    },
    whatIWouldDoDifferently:
      "In hindsight, I would have integrated real-time audio playback for vernacular prompts directly into the mobile interface, as rural evaluators often found spoken regional dialect descriptions more natural than reading technical English benchmark rubrics.",
    todoNotes: [
      "Verify exact statistical sample size breakdown between Northern and Central Indian clinic evaluators.",
      "Clarify whether the 3.4x lift is specifically for cultural cues or composite medical accuracy.",
    ],
  },

  mfine: {
    slug: "mfine",
    title: "Corporate Benefits & Claims Settlement",
    client: "MFine",
    year: "2023",
    role: "Product Designer & Design Systems Lead",
    timeline: "8 Weeks",
    team: "Aditya Diundi (Design Lead) · B2B Product Managers · Engineering Lead",
    tags: ["Enterprise SaaS", "InsurTech", "Design Systems", "Access Control"],
    summary:
      "A unified claims orchestration portal and design system for HR teams and TPAs, automating employee census onboarding and cashless hospital pre-authorizations.",
    verifiedMetric: {
      value: "100K+",
      label: "employees covered with <15 min approvals",
    },
    theProblem: [
      "Enterprise group health insurance management is notoriously fragmented. HR operations teams juggle disparate Third-Party Administrator (TPA) portals, disconnected employee census spreadsheets, and opaque cashless hospital authorization queues.",
      "Manual census updates cause catastrophic delays: hospital pre-authorizations are rejected because employee activation data was stuck in CSV limbo during a medical emergency.",
      "Legacy insurance portals suffer from brutal cognitive overload: dense unorganized tables, zero bulk action capabilities, and zero audit trails for disputed claims.",
    ],
    myRoleAndConstraints: {
      roleScope: [
        "Owned the information architecture for the B2B Employer Portal and the Arbiter Claims Tracker.",
        "Built a complete reusable design token catalog and component library for enterprise tables, modal policy matrices, and filter drawer states.",
        "Designed the batch CSV upload validation pipeline with visual diffing.",
      ],
      constraints: [
        "Enterprise Data Density: Operations coordinators needed to view 20+ columns per row with keyboard-only navigation.",
        "Data Integrity: An erroneous bulk deactivation could revoke health coverage for thousands of dependents.",
        "Legacy Backend: TPA APIs had high latency and asynchronous reconciliation cycles.",
      ],
    },
    processDecisions: [
      {
        title: "1. High-Density Employee Catalog with Visual Diff Dry-Runs",
        description:
          "Designed a keyboard-friendly employee management table supporting instant multi-select, bulk activate/deactivate, and dry-run CSV validation that highlights syntax errors and schema mismatches before changes are committed.",
        imageSrc: "/case-studies/corporate_claims.png",
        imageAlt: "MFine Corporate Claims and Benefits Architecture",
        tradeoffCaption:
          "Tradeoff: Prioritized information density over whitespace to ensure operations teams can audit 50 rows per viewport without horizontal scrolling.",
      },
      {
        title: "2. Arbiter 4-Stage Visual Claims Tracker",
        description:
          "Replaced cryptic tabular status codes with a visual stage-by-stage pipeline for cashless and reimbursement claims, tracking TPA reviews, queries, and MedPay settlements in real time.",
        imageSrc: "/case-studies/corporate_claims_cluster.png",
        imageAlt: "Arbiter Claims Flow Pipeline and Modal Policy Matrix",
        tradeoffCaption:
          "Tradeoff: Dedicates vertical screen space to the pipeline, but drastically reduces customer support tickets and status confusion.",
      },
    ],
    outcomeAndImpact: {
      metrics: [
        { value: "100K+", label: "employees covered under unified benefits" },
        { value: "< 15 min", label: "cashless hospitalization pre-authorizations" },
        { value: "-62%", label: "reduction in HR manual census update time" },
      ],
      impactNarrative:
        "The redesigned claims portal eliminated CSV reconciliation backlog and provided enterprise benefits managers with live visibility into hospital authorizations.",
    },
    whatIWouldDoDifferently:
      "I would establish an automated bi-directional API sync with common enterprise HRMS tools (Darwinbox, Zoho People) earlier in the design phase to remove manual CSV uploads entirely.",
    todoNotes: [
      "Confirm whether 100K+ employees refers to enrolled lives or total corporate beneficiaries including dependents.",
    ],
  },

  mosaic: {
    slug: "mosaic",
    title: "21-Day Habit & Hair Regimen Tracker",
    client: "Mosaic Wellness (ManMatters)",
    year: "2024",
    role: "UX Researcher & Product Designer",
    timeline: "4 Weeks",
    team: "Aditya Diundi (Product Design) · Growth PM · Behavioral Health Lead",
    tags: ["D2C HealthTech", "Behavioral Retention", "Habit Loops"],
    summary:
      "A routine retention engine pairing 1-tap daily micro-logs with automated doctor WhatsApp check-ins to prevent churn during delayed-gratification health regimens.",
    verifiedMetric: {
      value: "+12%",
      label: "lift in treatment continuation past Day 21",
    },
    theProblem: [
      "D2C holistic health regimens (hair loss, gut health, hormonal balance) suffer from an acute churn cliff between Day 7 and Day 21. Biological improvements take 60–90 days to physically manifest, leaving patients feeling unrewarded during early routine adoption.",
      "Most wellness apps overwhelm patients with complicated diet logs, excessive questionnaires, and rigid timers that turn healthcare into a chore.",
      "When users miss 2 consecutive days, guilt and lack of human validation trigger abandonment.",
    ],
    myRoleAndConstraints: {
      roleScope: [
        "Designed the 3-stage micro-commitment habit engine (Days 1–7 micro-log, Days 8–14 doctor check-in, Days 15–21 habit anchor).",
        "Conducted patient qualitative interviews to map anxiety triggers during the early treatment window.",
        "Created Figma design specifications and animated interaction prototypes.",
      ],
      constraints: [
        "Zero Cognitive Friction: Logging could not require more than 1 tap and 3 seconds of user attention.",
        "Clinical Credibility: Milestone messaging had to remain scientifically accurate without over-promising rapid results.",
      ],
    },
    processDecisions: [
      {
        title: "1. 1-Tap Daily Regimen Deck",
        description:
          "A clean morning and evening card deck where patients log serum application in one tap, accompanied by encouraging biological progress facts explaining what is happening at the cellular level.",
        imageSrc: "/case-studies/hair_tracker.png",
        imageAlt: "21-Day Regimen Playbook Flow in Figma",
        tradeoffCaption:
          "Tradeoff: Omitted detailed dosage input fields in exchange for maximizing daily logging adherence.",
      },
      {
        title: "2. Milestone Rewards & WhatsApp Doctor Hotline",
        description:
          "Celebrated habit formation checkpoints rather than superficial vanity metrics, backed by a direct WhatsApp bridge connecting patients to verified wellness coaches when doubt arose.",
        imageSrc: "/case-studies/hair_tracker.png",
        imageAlt: "Habit Anchor Milestones and WhatsApp Bridge",
        tradeoffCaption:
          "Tradeoff: Integrating WhatsApp bridges introduced off-platform interactions, but drastically lowered patient churn.",
      },
    ],
    outcomeAndImpact: {
      metrics: [
        { value: "+12%", label: "lift in treatment continuation past Day 21" },
        { value: "81%", label: "daily routine log completion rate" },
        { value: "< 4 min", label: "average coach response time on WhatsApp" },
      ],
      impactNarrative:
        "The habit engine successfully bridged the delayed-gratification gap, demonstrating that micro-commitments and transparent biological reassurance retain patients through invisible progress periods.",
    },
    whatIWouldDoDifferently:
      "I would have designed dynamic push notification timing anchored to user sleep-wake circadian schedules rather than static morning notifications.",
    todoNotes: [
      "Verify whether the +12% continuation rate was sustained at Day 60 and Day 90 follow-ups.",
    ],
  },

  digiaccel: {
    slug: "digiaccel",
    title: "UPI Limit Clarity & Spend Runway",
    client: "Digiaccel",
    year: "2024",
    role: "Product Designer (Fintech UX)",
    timeline: "3 Weeks",
    team: "Aditya Diundi (UX & Interaction Design) · Fintech Mentor Review",
    tags: ["Fintech", "Payments", "Error Recovery", "Proactive UX"],
    summary:
      "An ambient bank balance runway meter and 1-tap failover checkout flow that alerts users of daily transaction caps before payment initiation to eliminate payment failure anxiety.",
    verifiedMetric: {
      value: "-38%",
      label: "dropoff reduction at checkout",
    },
    theProblem: [
      "Over 350 million Indians execute billions of UPI transactions monthly, yet millions of payments fail abruptly with cryptic errors like 'Payment Limit Exceeded'.",
      "Users only learn they breached a limit AFTER payment fails at grocery counters or hospital bill desks, causing intense social awkwardness and transaction anxiety.",
      "UPI limits are fragmented: NPCI sets a ₹1,00,000 daily cap, individual banks impose secondary transaction-count limits (10 to 20 transfers/day), and user-set app limits conflict silently.",
    ],
    myRoleAndConstraints: {
      roleScope: [
        "Researched NPCI regulatory limit specifications across Tier-1 and PSU banks.",
        "Designed the pre-transaction ambient runway meter within the payment drawer.",
        "Architected the 1-tap split-route failover checkout flow.",
      ],
      constraints: [
        "NPCI Regulatory Limits: Payment screen architecture must adhere to strict guidelines on beneficiary verification.",
        "Zero Latency: Limit checks could not add extra round-trip delays to fast payment flows.",
      ],
    },
    processDecisions: [
      {
        title: "1. Ambient UPI Spend Runway",
        description:
          "A proactive progress indicator in the payment drawer showing real-time daily usage before payment: 'Today: ₹42,000 / ₹1,00,000 used · 9 / 20 transfers remaining'.",
        imageSrc: "/case-studies/upi_limit_meter_flow.png",
        imageAlt: "UPI Limit Clarity Screen Flow Stages",
        tradeoffCaption:
          "Tradeoff: Displays remaining bank limit ambiently without adding an extra confirmation screen to checkout.",
      },
      {
        title: "2. Intelligent Split-Route Checkout",
        description:
          "When an amount exceeds a single bank's remaining daily cap, the interface suggests splitting the payment across linked secondary accounts without re-entering recipient VPA.",
        imageSrc: "/case-studies/upi_limit_meter_flow.png",
        imageAlt: "Intelligent Split-Route Failover Flow",
        tradeoffCaption:
          "Tradeoff: Requires secondary bank authorization PIN, but saves users from absolute payment failure at the counter.",
      },
    ],
    outcomeAndImpact: {
      metrics: [
        { value: "-38%", label: "anticipated dropoff reduction at checkout" },
        { value: "92%", label: "user awareness of daily bank caps prior to payment" },
        { value: "1 Tap", label: "direct bank limit recovery settings access" },
      ],
      impactNarrative:
        "Shifting fintech error handling from reactive post-failure alerts to ambient pre-transaction meters eliminated payment anxiety and improved transaction success rates.",
    },
    whatIWouldDoDifferently:
      "I would test an offline SMS-based limit sync fallback for rural users experiencing intermittent network connectivity.",
    todoNotes: [
      "Document specific bank count limits (e.g. SBI vs HDFC daily counter limits) in the Figma appendix.",
    ],
  },

  adityaos: {
    slug: "adityaos",
    title: "AdityaOS & Pixel Studio",
    client: "Independent System",
    year: "2024",
    role: "Creator & Systems Engineer",
    timeline: "Ongoing",
    team: "Aditya Diundi (Sole Design & Engineering)",
    tags: ["Creative Sandbox", "Canvas Graphics", "Web Audio", "Retro Systems"],
    summary:
      "An in-browser retro operating system and pixel sandbox built with zero external runtime libraries, featuring Conway's Game of Life, falling sand physics, and WebAudio synth.",
    verifiedMetric: {
      value: "60 FPS",
      label: "client-side rendering with zero canvas dependencies",
    },
    liveUrl: "/os",
    theProblem: [
      "Most personal websites are static marketing brochures filled with buzzwords that talk about design capabilities without demonstrating deep technical craft or interactive systems design.",
      "Modern web software is bloated: simple drawing apps often import megabytes of heavy npm dependencies, resulting in sluggish performance and high memory overhead.",
    ],
    myRoleAndConstraints: {
      roleScope: [
        "Architected the modular window management system with floating, minimizing, dragging, and stacking order.",
        "Implemented custom canvas rasterization algorithms including Bresenham line interpolation, flood-fill, and cellular automata.",
        "Engineered real-time falling sand particle physics (sand, water, wood, acid) and WebAudio synth oscillators.",
      ],
      constraints: [
        "Zero External Runtime Libraries: Canvas rendering and audio synthesis had to run purely on standard HTML5 Canvas and Web Audio APIs.",
        "Responsive Performance: 60 FPS guaranteed across both mobile touchscreens and desktop keyboards.",
      ],
    },
    processDecisions: [
      {
        title: "1. Direct Canvas State Management",
        description:
          "Implemented pixel matrices directly on 2D canvas context, executing Conway's Game of Life rules and cellular sand physics in real time.",
        imageSrc: "/pixel_studio_og.png",
        imageAlt: "AdityaOS Interactive Web Desktop and Pixel Studio",
        tradeoffCaption:
          "Tradeoff: Writing custom canvas logic required deep mathematical handling, but yielded a lightweight bundle with zero third-party vulnerability risk.",
      },
      {
        title: "2. WebAudio Synthesizer Engine",
        description:
          "Created an on-the-fly audio oscillator triggering retro pentatonic square waves with every brush stroke and particle collision without downloading sound files.",
        imageSrc: "/pixel_studio_og.png",
        imageAlt: "Pixel Studio Synthesizer and Telemetry Engine",
        tradeoffCaption:
          "Tradeoff: Synthesis requires audio context user activation, but reduces page payload to 0 bytes for audio assets.",
      },
    ],
    outcomeAndImpact: {
      metrics: [
        { value: "60 FPS", label: "client-side rendering" },
        { value: "0", label: "external canvas or audio runtime dependencies" },
        { value: "100%", label: "client-side execution without server compute" },
      ],
      impactNarrative:
        "AdityaOS demonstrates that thoughtful system design and direct web primitives can deliver rich, delightful interactive experiences without bloat.",
    },
    whatIWouldDoDifferently:
      "I would implement WebGL shader support to calculate larger cellular automata matrices on mobile GPUs.",
    todoNotes: [
      "Add touch-gesture pinch-to-zoom support for mobile canvas manipulation.",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const caseStudy = CASE_STUDIES[params.slug];
  if (!caseStudy) return { title: "Case Study Not Found" };

  return {
    title: `${caseStudy.title} - Aditya Diundi`,
    description: caseStudy.summary,
    alternates: {
      canonical: `https://adityaos-delta.vercel.app/work/${caseStudy.slug}`,
    },
    openGraph: {
      title: `${caseStudy.title} - Aditya Diundi`,
      description: caseStudy.summary,
      url: `https://adityaos-delta.vercel.app/work/${caseStudy.slug}`,
      siteName: "Aditya Diundi",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: caseStudy.title,
        },
      ],
    },
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const study = CASE_STUDIES[params.slug];
  if (!study) notFound();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0c0d10] text-stone-900 dark:text-stone-100 px-6 sm:px-8 py-12 sm:py-20 transition-colors">
      <main className="max-w-[700px] mx-auto space-y-14 sm:space-y-16">
        {/* Navigation Back */}
        <nav aria-label="Breadcrumb">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to selected work</span>
          </Link>
        </nav>

        {/* 1. Header & Meta */}
        <header className="space-y-4 border-b border-stone-200 dark:border-stone-800 pb-8">
          <div className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-mono">
            <span>{study.client}</span> · <span>{study.year}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            {study.title}
          </h1>

          <p className="text-lg text-stone-700 dark:text-stone-300 leading-relaxed">
            {study.summary}
          </p>

          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono border-t border-stone-200 dark:border-stone-800">
            <div>
              <dt className="text-stone-400 dark:text-stone-500">ROLE</dt>
              <dd className="font-semibold text-stone-800 dark:text-stone-200 pt-0.5">
                {study.role}
              </dd>
            </div>
            <div>
              <dt className="text-stone-400 dark:text-stone-500">TIMELINE</dt>
              <dd className="font-semibold text-stone-800 dark:text-stone-200 pt-0.5">
                {study.timeline}
              </dd>
            </div>
            <div>
              <dt className="text-stone-400 dark:text-stone-500">TEAM / CONTEXT</dt>
              <dd className="font-semibold text-stone-800 dark:text-stone-200 pt-0.5">
                {study.team}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-500 dark:text-stone-400">
            <span>Tags: {study.tags.join(", ")}</span>
            {study.liveUrl && (
              <a
                href={study.liveUrl}
                target={study.liveUrl.startsWith("http") ? "_blank" : undefined}
                rel={study.liveUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-stone-900 dark:text-stone-100 underline underline-offset-4 hover:text-teal-700 dark:hover:text-teal-400 transition-colors inline-flex items-center gap-1 font-medium"
              >
                <span>Live prototype</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </header>

        {/* 2. The Problem */}
        <section aria-labelledby="problem-heading" className="space-y-4">
          <h2
            id="problem-heading"
            className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100"
          >
            The Problem
          </h2>
          <div className="space-y-3 text-stone-700 dark:text-stone-300 leading-relaxed text-base">
            {study.theProblem.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* 3. My Role & Constraints */}
        <section aria-labelledby="role-heading" className="space-y-6">
          <h2
            id="role-heading"
            className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100"
          >
            My Role & Constraints
          </h2>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-mono text-xs">
              What I Specifically Owned
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-stone-700 dark:text-stone-300 text-base">
              {study.myRoleAndConstraints.roleScope.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-mono text-xs">
              Operational & Technical Constraints
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-stone-700 dark:text-stone-300 text-base">
              {study.myRoleAndConstraints.constraints.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Process (Key Decisions & Visuals) */}
        <section aria-labelledby="process-heading" className="space-y-8">
          <h2
            id="process-heading"
            className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100"
          >
            Process & Key Decisions
          </h2>

          <div className="space-y-12">
            {study.processDecisions.map((decision, idx) => (
              <article key={idx} className="space-y-4">
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {decision.title}
                </h3>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-base">
                  {decision.description}
                </p>

                {decision.imageSrc && (
                  <div className="pt-2 space-y-2">
                    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      <Image
                        src={decision.imageSrc}
                        alt={decision.imageAlt || decision.title}
                        fill
                        sizes="(max-width: 960px) 100vw, 960px"
                        className="object-cover object-top"
                      />
                    </div>
                    {decision.tradeoffCaption && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 italic">
                        {decision.tradeoffCaption}
                      </p>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* 5. Outcome & Impact */}
        <section aria-labelledby="outcome-heading" className="space-y-6">
          <h2
            id="outcome-heading"
            className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100"
          >
            Outcome & Impact
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border border-stone-200 dark:border-stone-800 rounded-lg p-5 bg-stone-100/50 dark:bg-stone-900/50">
            {study.outcomeAndImpact.metrics.map((metric, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
                  {metric.value}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-base">
            {study.outcomeAndImpact.impactNarrative}
          </p>
        </section>

        {/* 6. What I Would Do Differently */}
        <section aria-labelledby="reflection-heading" className="space-y-4">
          <h2
            id="reflection-heading"
            className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100"
          >
            What I Would Do Differently
          </h2>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-base italic border-l-2 border-stone-300 dark:border-stone-700 pl-4 py-1">
            "{study.whatIWouldDoDifferently}"
          </p>
        </section>

        {/* Structured TODO block if information is pending decision */}
        {study.todoNotes && study.todoNotes.length > 0 && (
          <aside className="border border-amber-300/60 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <div className="font-semibold font-mono uppercase tracking-wider text-[11px]">
              Content Audit Flags for this Case Study:
            </div>
            <ul className="list-disc list-inside space-y-1">
              {study.todoNotes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </aside>
        )}

        {/* Navigation Footer */}
        <div className="border-t border-stone-200 dark:border-stone-800 pt-8 flex items-center justify-between text-sm">
          <Link
            href="/#work"
            className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to portfolio</span>
          </Link>
          <Link
            href="/work"
            className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            View all archive projects →
          </Link>
        </div>
      </main>
    </div>
  );
}
