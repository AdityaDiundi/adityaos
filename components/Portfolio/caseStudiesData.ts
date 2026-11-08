import { CaseStudy, EssayItem, LearnabilityMetric } from "./types";

export const FEATURED_CASE_STUDIES: CaseStudy[] = [
  {
    id: "janeval",
    number: "01",
    title: "JANEVAL",
    tagline: "Human-Centered AI Benchmarking for Indian Public Health",
    category: "AI & Public Health",
    year: "2024",
    timeline: "6 Weeks · Independent Research",
    role: "Lead Product Designer & Systems Architect",
    accentColor: "#10B981", // Emerald / Sage
    accentGlow: "rgba(16, 185, 129, 0.25)",
    badge: "Flagship Research",
    impactMetrics: [
      { label: "Blind Comparisons", value: "100+", detail: "Validated by grassroots evaluators" },
      { label: "Cultural Fidelity Gain", value: "3.4x", detail: "Over generic prompts" },
      { label: "Domain Evaluators", value: "10", detail: "Frontline health workers & specialists" },
    ],
    overview:
      "Frontier AI models (GPT-4 Vision, Gemini 1.5) generate public health imagery filled with Western assumptions and cultural hallucinations—misrepresenting ASHA worker attire, placing digital scales in primary rural clinics where hanging spring scales are mandatory, and rendering garbled Devanagari script. JANEVAL is an evidence-first blind pairwise evaluation framework designed to benchmark frontier model fidelity in rural Indian public health contexts.",
    theProblem: {
      friction:
        "Health workers and policymakers cannot trust AI-generated clinical infographics or educational materials if the equipment and cultural cues are fundamentally erroneous.",
      context:
        "Most LLM evaluation platforms (LMSYS, Chatbot Arena) rely on general text queries and tech-savvy crowdworkers. No benchmark evaluated whether an Anganwadi growth monitoring session or maternal clinic was depicted with medical and sociological truth.",
      insight:
        "Evaluation rubrics must be authored from the perspective of frontline health workers, not ML engineers. Evaluators need structured, discrete 3-point checks rather than vague 5-star ratings.",
    },
    theSolution: {
      headline: "A Pairwise Blind Evaluation Protocol & Tactile Design System",
      pillars: [
        {
          title: "Blind Pairwise Arena",
          description:
            "Evaluators view two unlabeled AI images generated from the same prompt (e.g. Scenario 04: Anganwadi growth monitoring) and vote on real-world authenticity.",
          tag: "Interaction Design",
        },
        {
          title: "3-Tier Ground-Truth Rubric",
          description:
            "Deep checks on (1) Cultural Fidelity (uniforms, courtyard setting), (2) Medical Accuracy (scale type, health card registers), and (3) Environmental Authenticity (vernacular Devanagari wall art).",
          tag: "Diagnostic UX",
        },
        {
          title: "Ethical Consent Architecture",
          description:
            "Transparent upfront consent, data anonymization, and guaranteed discard of incomplete sessions to respect grassroots evaluators' time.",
          tag: "Ethics & Systems",
        },
      ],
    },
    designSystemTokens: {
      canvas: "#F7F8F5",
      primary: "#0F2E24",
      accent: "#4E8F6F",
      border: "#E3E7E2",
    },
    figmaUrl: "https://www.figma.com/design/zSSrngf4wlhPPxg0cHlFRE/Ketto-",
    previewType: "janeval_eval",
  },
  {
    id: "upi-limit-clarity",
    number: "02",
    title: "UPI Limit Clarity",
    tagline: "Preventing Failure Anxiety in Daily Digital Payments",
    category: "Fintech & Payments",
    year: "2024",
    timeline: "3 Weeks · Digiaccel Assignment",
    role: "Product Designer (Fintech UX & Error Recovery)",
    accentColor: "#00F0FF", // Cyan
    accentGlow: "rgba(0, 240, 255, 0.25)",
    badge: "Fintech Systems",
    impactMetrics: [
      { label: "Anticipated Dropoff Reduction", value: "38%", detail: "At payment checkout" },
      { label: "Limit Awareness", value: "92%", detail: "Pre-transaction transparency" },
      { label: "Recovery Clicks", value: "1 Tap", detail: "Direct bank limit adjustment" },
    ],
    overview:
      "Over 350 million Indians execute billions of UPI transactions monthly, yet millions of payments fail abruptly with cryptic errors like 'Payment Limit Exceeded'. Users are left panicking at grocery counters or hospital checkouts, unaware whether the failure was caused by NPCI daily caps (₹1 Lakh), bank-specific limits, or count limits (max 20 transfers/day).",
    theProblem: {
      friction:
        "Cryptic reactive errors: Users only learn they breached a limit AFTER their payment fails, creating intense social awkwardness and transaction anxiety.",
      context:
        "UPI limits are fragmented: NPCI sets a ₹1,00,000 ceiling, individual banks (SBI, HDFC) impose secondary transaction-count limits (10 to 20/day), and user-set app limits conflict silently.",
      insight:
        "Fintech apps must shift from reactive post-failure alerts to ambient, pre-transaction meters that communicate remaining runway before the user taps 'Pay'.",
    },
    theSolution: {
      headline: "Ambient Limit Runway & Contextual Split-Payment Recovery",
      pillars: [
        {
          title: "Live UPI Meter Runway",
          description:
            "A proactive progress indicator in the payment drawer showing real-time daily usage: 'Today: ₹42,000 / ₹1,00,000 used · 9 / 20 transfers remaining'.",
          tag: "Proactive Feedback",
        },
        {
          title: "Intelligent Split-Route Suggestions",
          description:
            "When an amount exceeds the single-bank remaining cap, the interface automatically suggests splitting the transfer across linked secondary accounts without re-entering recipient VPA.",
          tag: "Error Recovery",
        },
        {
          title: "Direct Bank-Tier Navigation",
          description:
            "Contextual 1-tap deep links to bank netbanking or UPI limit enhancement settings with verified status badges.",
          tag: "Information Architecture",
        },
      ],
    },
    figmaUrl: "https://www.figma.com/design/zCmxQ3KwFy0mhlFbtlApua/UPI-Limit-Clarity---digiaccel-Assignment?node-id=0-1",
    previewType: "upi_meter",
  },
  {
    id: "hair-tracker",
    number: "03",
    title: "21-Day Habit & Hair Tracker",
    tagline: "Behavioral Retention Engine for Delayed-Outcome Health Regimens",
    category: "D2C HealthTech",
    year: "2024",
    timeline: "4 Weeks · D2C Health Exploration",
    role: "UX Researcher & Product Designer",
    accentColor: "#F59E0B", // Amber
    accentGlow: "rgba(245, 158, 11, 0.25)",
    badge: "Behavioral Retention",
    impactMetrics: [
      { label: "Day 14 Retention", value: "+44%", detail: "In habit adherence cohort" },
      { label: "Daily Log Rate", value: "81%", detail: "Via micro-commitment prompts" },
      { label: "Coach Connect Speed", value: "< 4 min", detail: "Direct WhatsApp bridge" },
    ],
    overview:
      "D2C holistic health regimens (such as hair loss and gut health) suffer from an acute churn cliff between Day 7 and Day 21. Biological improvements take 60–90 days to physically manifest, leaving users feeling unrewarded during initial routine adoption.",
    theProblem: {
      friction:
        "Delayed gratification: Users abandon tedious multi-step morning/evening serum and vitamin routines before any visible biological progress can occur.",
      context:
        "Most wellness apps overwhelm users with complicated diet logs, excessive questionnaires, and rigid timers that turn healthcare into a chore.",
      insight:
        "Motivation during invisible progress periods requires tactile visual streaks, microscopic daily validation, and frictionless human reassurance.",
    },
    theSolution: {
      headline: "Micro-Commitments, Photo Milestones, and Ambient Expert Bridge",
      pillars: [
        {
          title: "Tactile Daily Routine Carousel",
          description:
            "A clean morning/evening card deck where users log serum application in one tap, accompanied by micro-animations and encouraging biological progress facts.",
          tag: "Interaction Craft",
        },
        {
          title: "Day 21 Milestone Reward Unlocks",
          description:
            "Predictable achievement checkpoints celebrating habit formation rather than superficial vanity metrics.",
          tag: "Behavioral UX",
        },
        {
          title: "Instant 1-Tap Coach Hotline",
          description:
            "An integrated WhatsApp bridge providing direct access to verified wellness coaches to answer routine questions and soothe anxiety within minutes.",
          tag: "Support Architecture",
        },
      ],
    },
    figmaUrl: "https://www.figma.com/design/jYWIU8kR4JiRbQU6UcctXm/21-Day-Hair-Tracker?node-id=0-1",
    previewType: "hair_tracker",
  },
  {
    id: "corporate-claims",
    number: "04",
    title: "Corporate Claims & Arbiter (S3)",
    tagline: "Streamlining Enterprise Group Health & TPA Settlement Operations",
    category: "Enterprise SaaS",
    year: "2023",
    timeline: "8 Weeks · B2B Enterprise InsurTech",
    role: "Product Designer & Design Systems Lead",
    accentColor: "#8B5CF6", // Purple
    accentGlow: "rgba(139, 92, 246, 0.25)",
    badge: "Enterprise Systems",
    impactMetrics: [
      { label: "HR Admin Task Time", value: "-62%", detail: "Bulk employee onboarding" },
      { label: "Claim Status Disputes", value: "-45%", detail: "Via live Arbiter audit logs" },
      { label: "System Consistency", value: "100%", detail: "Reusable design token catalog" },
    ],
    overview:
      "Enterprise group health insurance management is notoriously fragmented. HR operations teams juggle disparate Third-Party Administrator (TPA) portals, disconnected employee census spreadsheets, and opaque cashless hospital authorization queues.",
    theProblem: {
      friction:
        "Manual census updates cause catastrophic delays where hospital pre-authorizations are rejected because employee activation data was stuck in CSV limbo.",
      context:
        "Existing legacy insurance portals have brutal cognitive overload: dense unorganized tables, zero bulk action capabilities, and zero audit trails.",
      insight:
        "B2B enterprise portals must prioritize high-density scanability, batch processing with clear dry-run previews, and transparent state pipelines.",
    },
    theSolution: {
      headline: "Unified Employee Catalog & Transparent Arbiter Claim Tracker",
      pillars: [
        {
          title: "High-Density Catalog & Bulk Ops",
          description:
            "A keyboard-friendly employee management table supporting instant multi-select, bulk activate/deactivate, and CSV dry-run validation with visual diffing.",
          tag: "Enterprise UX",
        },
        {
          title: "Arbiter Claims Flow Pipeline",
          description:
            "A visual stage-by-stage pipeline for cashless and reimbursement claims tracking TPA reviews, queries, and MedPay settlements in real time.",
          tag: "System Workflow",
        },
        {
          title: "Strict Role-Based Access Views",
          description:
            "Custom-tailored permission modes separating high-level corporate benefits directors from operational HR payroll coordinators.",
          tag: "Access Control",
        },
      ],
    },
    figmaUrl: "https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211",
    previewType: "claims_portal",
  },
  {
    id: "aarohi-lab",
    number: "05",
    title: "Aarohi Bal Sansar: Learnability Lab",
    tagline: "Grassroots Pedagogical Diagnostic for Rural Himalayan Schools",
    category: "Pedagogical Analytics",
    year: "2023",
    timeline: "1 Year · Grassroots Fieldwork (Uttarakhand)",
    role: "Field Researcher & Systems Designer",
    accentColor: "#38BDF8", // Sky Blue
    accentGlow: "rgba(56, 189, 248, 0.25)",
    badge: "Field Ethnography",
    impactMetrics: [
      { label: "Students Assessed", value: "100+", detail: "Across Grades 4 through 8" },
      { label: "Diagnostic Vectors", value: "4", detail: "Logic, Pattern, Spatial, Language" },
      { label: "Teacher Adoption", value: "100%", detail: "Adopted for personalized curricula" },
    ],
    overview:
      "During my grassroots work in Peora, Uttarakhand, I conducted a deep ethnographic study of how first-generation rural learners process complex information. Traditional standardized tests failed to reflect true student aptitude. I designed the Learnability Diagnostic Framework to decouple intrinsic cognitive aptitude from formal English language barriers.",
    theProblem: {
      friction:
        "Rote examination metrics misclassify rural students with high spatial and logical reasoning as 'underperforming' simply due to vernacular language test hurdles.",
      context:
        "Village schools lacked diagnostic tools to identify individual cognitive stumbling blocks before students fell irrevocably behind.",
      insight:
        "Visual puzzle games and pattern-based physical manipulatives reveal profound reasoning capabilities that standard pen-and-paper tests completely obscure.",
    },
    theSolution: {
      headline: "4-Vector Cognitive Matrix & Teacher Intervention Dashboard",
      pillars: [
        {
          title: "Non-Verbal Diagnostic Tasks",
          description:
            "Language-agnostic visual logic, pattern recognition, and geometric spatial challenges allowing true cognitive capacity to emerge.",
          tag: "Research Protocol",
        },
        {
          title: "Learnability Performance Matrix",
          description:
            "Visual heatmaps mapping student performance clusters to help teachers identify specific learning modalities and cognitive friction points.",
          tag: "Data Visualization",
        },
        {
          title: "Targeted Classroom Interventions",
          description:
            "Actionable pedagogical handbooks enabling teachers to adapt lessons to concrete student cognitive styles rather than uniform lectures.",
          tag: "Pedagogical Impact",
        },
      ],
    },
    previewType: "learnability_matrix",
  },
];

export const LEARNABILITY_METRICS: LearnabilityMetric[] = [
  {
    category: "Pattern Recognition & Sequencing",
    sampleSize: 42,
    baseline: "46% comprehension",
    postIntervention: "78% accuracy",
    insight: "First-generation learners excelled dramatically when instructions shifted from formal English prompts to visual sequence tokens.",
  },
  {
    category: "Spatial & Geometric Reasoning",
    sampleSize: 38,
    baseline: "52% baseline",
    postIntervention: "84% mastery",
    insight: "Manipulative tangram tasks revealed superior 3D intuition rooted in village craftsmanship and rural terrain navigation.",
  },
  {
    category: "Logical Deduction & Rule Inference",
    sampleSize: 40,
    baseline: "39% baseline",
    postIntervention: "71% fluency",
    insight: "Gamified rule-discovery challenges removed exam fear, fostering spontaneous collaborative problem-solving between peer groups.",
  },
];

export const FEATURED_ESSAYS: EssayItem[] = [
  {
    id: "identity-in-youth-clubs-in-india",
    title: "Identity In Youth Clubs In India",
    category: "Essay",
    source: "India Fellow",
    readTime: "6 min read",
    year: "2024",
    excerpt:
      "Examining collective identity formation, youth empowerment networks, and active citizenship across panchayats in rural Bihar.",
    url: "https://indiafellow.org/blog/all-posts/identity-in-youth-clubs-in-india/",
    theme: "Community Systems",
  },
  {
    id: "motivation-in-rural-leadership-programs",
    title: "Motivation In Rural Leadership Programs",
    category: "Essay",
    source: "India Fellow",
    readTime: "5 min read",
    year: "2024",
    excerpt:
      "Understanding intrinsic motivation drivers prompting rural youth to participate in unventilated 39°C community spaces.",
    url: "https://indiafellow.org/blog/all-posts/motivation-in-rural-leadership-programs/",
    theme: "Behavioral Drivers",
  },
  {
    id: "questions-for-self-discovery",
    title: "Questions For Self-Discovery From A Human Process Lab",
    category: "Essay",
    source: "India Fellow",
    readTime: "6 min read",
    year: "2024",
    excerpt:
      "Key introspective reflections from the ISABS Basic Human Process Lab at Sevagram, exploring interpersonal dynamics and self-awareness.",
    url: "https://indiafellow.org/blog/all-posts/questions-for-self-discovery-from-a-human-process-lab/",
    theme: "Introspection & ISABS",
  },
  {
    id: "youth-masterpiece-collaboration-art",
    title: "Youth Masterpiece: Fostering Collaboration Through Art",
    category: "Essay",
    source: "India Fellow",
    readTime: "4 min read",
    year: "2024",
    excerpt:
      "Designing experiential midline activities in the Youth Resource Manual to build teamwork, communication, and creative confidence.",
    url: "https://indiafellow.org/blog/all-posts/youth-masterpiece-fostering-collaboration-through-art/",
    theme: "Pedagogy & Design",
  },
  {
    id: "balancing-act-rajasthan-water-crisis",
    title: "Balancing Act: Navigating Choices In Rural Rajasthan's Water Crisis",
    category: "Essay",
    source: "India Fellow",
    readTime: "8 min read",
    year: "2024",
    excerpt:
      "First-person ethnography documenting groundwater depletion, fluoride contamination, and the resilience of rural families in Jaipur.",
    url: "https://indiafellow.org/blog/all-posts/balancing-act-navigating-choices-in-rural-rajasthans-water-crisis/",
    theme: "Environmental Ethnography",
  },
  {
    id: "online-gaming-india-toxic",
    title: "Why Online Gaming in India Feels So Toxic",
    category: "Essay",
    source: "Medium",
    readTime: "6 min read",
    year: "2024",
    excerpt:
      "A cultural exploration of language limits, emotional articulation, and normalized hostility inside Indian competitive multiplayer lobbies.",
    url: "https://adityadiundi.medium.com/why-online-gaming-in-india-feels-so-toxic-1d506b87acf8",
    theme: "Digital Culture",
  },
  {
    id: "home-brewing-style",
    title: "Home Brewing in Style",
    category: "Essay",
    source: "Medium",
    readTime: "4 min read",
    year: "2024",
    excerpt:
      "A deep dive into microbrewing, craft techniques, and design showcases for niche personal brewing workflows.",
    url: "https://adityadiundi.medium.com/home-brewing-in-style-6fcdaff414b5",
    theme: "Craft & Design",
  },
  {
    id: "on-borrowed-beliefs",
    title: "On Borrowed Beliefs",
    category: "Essay",
    source: "Personal Reflection",
    readTime: "4 min read",
    year: "2024",
    excerpt:
      "Investigating the cognitive cost of unexamined dogma, inherited social defaults, and the slow reclamation of epistemic agency.",
    url: "#",
    theme: "Philosophy of Mind",
    content: [
      "I don't believe in God.",
      "",
      "Not in the one I was told about by my family. It was a choice I made, though I precisely don’t remember when. What I do remember is faith slowly being overtaken by a thought process that made it difficult for me to be a theist.",
      "",
      "This is not about whether the God I was told about exists or not. I am talking about the privilege I have been fortunate enough to have: the privilege of having parents who, though they still ask me not to eat non-veg on certain days, respect my denial whenever it comes up.",
      "",
      "I also often wonder about families where a belief system is taught right from infancy, and how such exposure shapes a person’s ability to question it, or even to have a choice about whether or not to follow it.",
      "",
      "— Aditya",
    ],
  },
  {
    id: "daughters-of-misogyny",
    title: "Daughters of Misogyny",
    category: "Essay",
    source: "Personal Reflection",
    readTime: "3 min read",
    year: "2024",
    excerpt:
      "A systemic exploration of generational conditioning, silent domestic hierarchies, and how structural misogyny replicates across rural familial nodes.",
    url: "#",
    theme: "Social Structures",
    content: [
      "This world works in the strangest of the ways.",
      "Girls are born to the most misogynistic of the men.",
      "Some change, some remain the same.",
      "",
      "— Aditya",
    ],
  },
  {
    id: "ganje-logon-ki-panchayat",
    title: "गंजे लोगों की पंचायत",
    category: "Poem",
    source: "India Fellow",
    readTime: "3 min read",
    year: "2025",
    excerpt:
      "पारिवारिक बैठकों, उम्र के तकाजों और सामाजिक संकोचों पर व्यंग्यात्मक काव्य और आत्मस्वीकृति का अनूठा मेल।",
    url: "https://indiafellow.org/blog/all-posts/%e0%a4%97%e0%a4%82%e0%a4%9c%e0%a5%87-%e0%a4%b2%e0%a5%8b%e0%a4%97%e0%a5%8b%e0%a4%82-%e0%a4%95%e0%a5%80-%e0%a4%aa%e0%a4%82%e0%a4%9a%e0%a4%be%e0%a4%af%e0%a4%a4/",
    theme: "व्यंग्य / Satire",
  },
  {
    id: "tasveerein-chhoti-honi-chahiye",
    title: "तस्वीरें छोटी होनी चाहिए",
    category: "Poem",
    source: "काव्य / Poetry",
    readTime: "2 min read",
    year: "2024",
    excerpt:
      "यादों के बोझ, संकोचों और पुरानी तस्वीरों के आकार पर एक विचारशील काव्यात्मक दृष्टि।",
    url: "#",
    theme: "काव्य / Poetics",
    content: [
      "तस्वीरें छोटी होनी चाहिए,",
      "लोग पास आकर देखते हैं।",
      "",
      "दूर से तो चाँद भी दिखता है,",
      "पर उसका रोज़ थोड़ी सोचते हैं।",
      "",
      "वो बड़ा है,",
      "यूँ ही खड़ा है,",
      "उसे ख़ास थोड़ी समझते हैं।",
      "",
      "वो तस्वीर जो छोटी होती है,",
      "उसमें तुझे खोजते हैं।",
      "",
      "मेरी एक तस्वीर बनाना,",
      "उसमें छोटी-सी एक लकीर बनाना।",
      "",
      "लकीर के इस तरफ़ मुझे बनाना,",
      "और उस तरफ़ रखना ज़माना।",
      "",
      "— आदित्य",
    ],
  },
  {
    id: "nahi-bulana",
    title: "नहीं बुलाना",
    category: "Poem",
    source: "काव्य / Poetry",
    readTime: "2 min read",
    year: "2024",
    excerpt:
      "दूरी, आत्मसम्मान और रिश्तों की मौन सीमाओं पर एक मर्मस्पर्शी कविता।",
    url: "#",
    theme: "काव्य / Poetics",
    content: [
      "किसे बुलाना कहाँ बुलाना,",
      "कोई रुपया कोई आना।",
      "किसे बुलाना क्यों बुलाना,",
      "उसने अब नहीं आना।",
      "",
      "इधर हुआ जो उधर कहाँ है?",
      "नीचे क्यों ये आसमान है?",
      "शौक गया है सांस गयी है,",
      "मन की आवाज गयी है।",
      "",
      "किसे बताना क्यों बताना,",
      "सब सही जब यही सुनाना।",
      "उधर की बातें नहीं बताना,",
      "इधर नहीं हुआ जब आना।",
      "",
      "धीमे धीमे यूंही रोजाना,",
      "वक्त कटे दिन घटे,",
      "दर्द जब नहीं बंटे,",
      "कल शायद आसमान हटे।",
      "",
      "धीरे धीरे थम गया,",
      "वक्त सारा कहाँ गया?",
      "ना जाने कब ये आसमान हटेगा,",
      "दर्द मेरा कब घटेगा?",
      "",
      "इसलिए अब नहीं बुलाना,",
      "नहीं बुलाना, नहीं बुलाना।",
      "",
      "— आदित्य",
    ],
  },
  {
    id: "the-fire-i-watered",
    title: "The Fire I Watered",
    category: "Poem",
    source: "Poetry",
    readTime: "2 min read",
    year: "2024",
    excerpt:
      "A lyrical meditation on paradoxical efforts, childhood memories, and the quiet acceptance of transformation.",
    url: "#",
    theme: "Poetics & Reflection",
    content: [
      "I knew fire when I was a child.",
      "I watered it as I grew.",
      "I became smoke which disappeared.",
      "I for once would want a few more years",
      "Of the childhood which had fire,",
      "For the fire which I watered,",
      "For the smoke to reappear.",
      "I wish for it all again.",
      "I yearn for it to happen exactly as it did.",
      "For the fun was in the cycle.",
      "I wish to be hidden within.",
      "",
      "— Aditya",
    ],
  },
];

export interface YouTubeItem {
  id: string;
  title: string;
  category: string;
  url: string;
  duration: string;
}

export const FEATURED_YOUTUBE_VIDEOS: YouTubeItem[] = [
  {
    id: "gnzulGkZYDQ",
    title: "Don’t worry, I am here. Hard Hitting Boom Bot",
    category: "Shorts",
    url: "https://www.youtube.com/watch?v=gnzulGkZYDQ",
    duration: "0:30",
  },
  {
    id: "k3goWR93wbo",
    title: "Playing against aim god chamber 🌪️🥴",
    category: "Shorts",
    url: "https://www.youtube.com/watch?v=k3goWR93wbo",
    duration: "0:45",
  },
  {
    id: "pVAsX76IOgw",
    title: "1v4 Clutch 🕺☺️🌪️ #donk #cs2",
    category: "Highlight",
    url: "https://www.youtube.com/watch?v=pVAsX76IOgw",
    duration: "0:52",
  },
  {
    id: "3Xe_lpRTBDs",
    title: "Trainspotting everybody #falsepeek #cs2",
    category: "Match",
    url: "https://www.youtube.com/watch?v=3Xe_lpRTBDs",
    duration: "0:48",
  },
  {
    id: "Ap8IwdhArQ4",
    title: "Another savage 🕺 #mlbb",
    category: "Shorts",
    url: "https://www.youtube.com/watch?v=Ap8IwdhArQ4",
    duration: "0:34",
  },
  {
    id: "RFq3SF1kN18",
    title: "Savage Highlight 🕺 #mobalegends",
    category: "Highlight",
    url: "https://www.youtube.com/watch?v=RFq3SF1kN18",
    duration: "0:40",
  },
  {
    id: "l6kADNHmNDc",
    title: "Monica 👯‍♂️💃🕺 #cs2",
    category: "Match",
    url: "https://www.youtube.com/watch?v=l6kADNHmNDc",
    duration: "0:35",
  },
];

