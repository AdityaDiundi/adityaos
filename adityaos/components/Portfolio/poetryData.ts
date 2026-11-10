export interface PoetryLine {
  text: string;
  source: string;
  lang: "hi" | "en";
}

export const WRITING_LINES: string[] = [
  "तस्वीरें छोटी होनी चाहिए, लोग पास आकर देखते हैं।",
  "This world works in the strangest of ways; girls are born to the most misogynistic of men.",
  "लकीर के इस तरफ़ मुझे बनाना, और उस तरफ़ रखना ज़माना।",
  "Faith was slowly overtaken by a thought process that made it difficult for me to be a theist.",
  "रास्ते तब भी बनते हैं जब मंज़िल का कोई नक्शा नहीं होता।",
  "कुछ बातें अनकही ही भली, कुछ मुलाकातें अधूरी ही पूरी।",
  "The quietest room in the house is the one where nothing needs explaining.",
];

export const POETRY_LINES: PoetryLine[] = [
  {
    text: "तस्वीरें छोटी होनी चाहिए, लोग पास आकर देखते हैं।",
    source: "तस्वीरें छोटी होनी चाहिए",
    lang: "hi",
  },
  {
    text: "This world works in the strangest of ways; girls are born to the most misogynistic of men.",
    source: "Daughters of Misogyny",
    lang: "en",
  },
  {
    text: "लकीर के इस तरफ़ मुझे बनाना, और उस तरफ़ रखना ज़माना।",
    source: "काव्य संकलन",
    lang: "hi",
  },
  {
    text: "Faith was slowly overtaken by a thought process that made it difficult for me to be a theist.",
    source: "On Borrowed Beliefs",
    lang: "en",
  },
  {
    text: "रास्ते तब भी बनते हैं जब मंज़िल का कोई नक्शा नहीं होता।",
    source: "डायरी के पन्ने",
    lang: "hi",
  },
  {
    text: "कुछ बातें अनकही ही भली, कुछ मुलाकातें अधूरी ही पूरी।",
    source: "नहीं बुलाना",
    lang: "hi",
  },
  {
    text: "The quietest room in the house is the one where nothing needs explaining.",
    source: "Field Journal",
    lang: "en",
  },
];
