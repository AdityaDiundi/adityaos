export interface PoetryLine {
  text: string;
  source: string;
  lang: "hi" | "en";
}

export const POETRY_LINES: PoetryLine[] = [
  {
    text: "तस्वीरें छोटी होनी चाहिए, लोग पास आकर देखते हैं।",
    source: "तस्वीरें छोटी होनी चाहिए (2024)",
    lang: "hi",
  },
  {
    text: "लकीर के इस तरफ़ मुझे बनाना, और उस तरफ़ रखना ज़माना।",
    source: "काव्य संकलन (2024)",
    lang: "hi",
  },
  {
    text: "Between institutional ledgers and village courtyards, trust is held in oral memory.",
    source: "Fieldwork Notes · Kishanganj (2022)",
    lang: "en",
  },
  {
    text: "This world works in the strangest ways: quiet dignity outlasts structural silence.",
    source: "Personal Reflection (2024)",
    lang: "en",
  },
  {
    text: "Systems are not built on screens; they are lived in the daily frictions of people.",
    source: "Design Technologist Notebook (2024)",
    lang: "en",
  },
];
