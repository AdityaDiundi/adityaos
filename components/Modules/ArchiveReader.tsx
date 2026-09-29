"use client";

import React, { useState } from "react";
import { Folder, FileText, ChevronRight, ChevronDown, Code2 } from "lucide-react";

interface ArchiveItem {
  id: string;
  path: string;
  title: string;
  category: "essays" | "poetry";
  extension: "md" | "txt";
  lines: string[];
}

const ARCHIVE_DATA: Record<string, ArchiveItem> = {
  "essays/Daughters_of_Misogyny.md": {
    id: "daughters",
    path: "essays/Daughters_of_Misogyny.md",
    title: "Daughters of Misogyny",
    category: "essays",
    extension: "md",
    lines: [
      "# Daughters of Misogyny",
      "",
      "> \"The architecture of silence is rarely built by enemies;",
      "> it is furnished by mothers who survived the storm by holding their breath.\"",
      "",
      "---",
      "",
      "We often discuss misogyny as an overt siege—a barricade thrown against the horizon.",
      "Yet its most resilient machinery is domestic and quiet, passed from palm to palm",
      "like an ancestral brass bowl. It is taught not through violence alone, but through",
      "the choreography of accommodation.",
      "",
      "When a daughter watches her mother shrink her voice into the corners of the dining hall,",
      "she does not merely witness survival; she internalizes an instruction manual on scale.",
      "The curriculum is subtle: speak lower, take smaller portions of air, do not disturb",
      "the balance of the father's temper.",
      "",
      "To unlearn this heritage is not an intellectual exercise.",
      "It requires excavating the very cadence of how one apologizes before existing.",
      "When I observe the systems we construct—in software, in societal contracts,",
      "in our daily codebases—I find the same temptation to normalize systemic friction",
      "simply because 'it has always resolved this way.'",
      "",
      "True rebellion begins in refusing to inherit the compromise.",
    ],
  },
  "poetry/तस्वीरें_छोटी_होनी_चाहिए.txt": {
    id: "tasveerein",
    path: "poetry/तस्वीरें_छोटी_होनी_चाहिए.txt",
    title: "तस्वीरें छोटी होनी चाहिए",
    category: "poetry",
    extension: "txt",
    lines: [
      "// कविता: तस्वीरें छोटी होनी चाहिए",
      "// विधा: समकालीन हिंदी मुक्तछंद",
      "",
      "दीवार पर टंगी बड़ी तस्वीरों में",
      "अक्सर लोग छूट जाते हैं,",
      "या फिर उनका कद इतना बढ़ जाता है",
      "कि पीछे की उखड़ी हुई सफेदी",
      "साफ नज़र आने लगती है।",
      "",
      "तस्वीरें छोटी होनी चाहिए,",
      "इतनी छोटी कि पर्स के किसी पुराने कोने में",
      "बिना मुड़े समा सकें।",
      "",
      "इतनी छोटी कि जब भी निकालो,",
      "उंगलियों के पोरों के बीच",
      "चेहरे का आधा हिस्सा छिप जाए,",
      "और जो छिप जाए—",
      "उसे याद करने का बहाना मिल जाए।",
      "",
      "बड़ी तस्वीरें सवाल पूछती हैं,",
      "छोटी तस्वीरें सिर्फ मुस्कुरा कर चुप रह जाती हैं।",
      "",
      "— आदित्य",
    ],
  },
  "poetry/गंजे_लोगों_की_पंचायत.txt": {
    id: "panchayat",
    path: "poetry/गंजे_लोगों_की_पंचायत.txt",
    title: "गंजे लोगों की पंचायत",
    category: "poetry",
    extension: "txt",
    lines: [
      "// व्यंग्य-कविता: गंजे लोगों की पंचायत",
      "// विधा: सामाजिक हास्य-व्यंग्य",
      "",
      "चौराहे की नीम के नीचे",
      "आज एक गंभीर सभा बैठी थी।",
      "एजेंडा था: 'धूप का सीधा सिर पर प्रहार,",
      "और कंघों के घटते कारोबार पर गहरा विचार।' ",
      "",
      "अध्यक्ष महोदय ने चकाचक माथे पर हाथ फेरा,",
      "बोले: 'मित्रों! बाल तो मोह-माया का जाल थे,",
      "जो गिर गए, वो दरअसल हमारे विचार थे।",
      "अब खोपड़ी हमारी खुली किताब है,",
      "दुनिया के हर सवाल का बेबाक जवाब है!'",
      "",
      "पीछे से एक नौजवान ने धीरे से पूछा—",
      "'हुज़ूर, फिर तेल की शीशी क्यों अलमारी में छुपा रखी है?'",
      "",
      "पंचायत में सन्नाटा छा गया,",
      "और सबने मिलकर सर्वसम्मति से प्रस्ताव पास किया:",
      "'टोपी पहनना ही अब राष्ट्रीय शिष्टाचार है!'",
      "",
      "— आदित्य",
    ],
  },
};

export const ArchiveReader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>("essays/Daughters_of_Misogyny.md");
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    essays: true,
    poetry: true,
  });

  const toggleFolder = (folder: string) => {
    setOpenFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  const currentItem = ARCHIVE_DATA[selectedFile] || ARCHIVE_DATA["essays/Daughters_of_Misogyny.md"];

  return (
    <div className="flex flex-col h-full bg-onedark-dark select-text font-mono text-xs">
      {/* Nano/Vim top buffer tabs */}
      <div className="h-7 bg-onedark-surface border-b border-onedark-border flex items-center justify-between px-3 text-[11px] select-none">
        <div className="flex items-center gap-2 truncate">
          <span className="px-1.5 py-0.5 rounded bg-onedark-purple/20 text-onedark-purple text-[10px] font-bold">
            VIM
          </span>
          <span className="text-onedark-textBright font-semibold truncate">
            {currentItem.path}
          </span>
          <span className="text-onedark-muted">[RO]</span>
        </div>
        <div className="text-onedark-muted hidden sm:flex items-center gap-3 text-[10px]">
          <span>utf-8</span>
          <span>markdown/txt</span>
          <span>lines: {currentItem.lines.length}</span>
        </div>
      </div>

      {/* Main 2-column flexbox */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Directory Tree (Nvim Tree style) */}
        <div className="w-56 md:w-64 border-r border-onedark-border bg-onedark-surface/40 flex flex-col flex-shrink-0 select-none">
          <div className="px-3 py-2 text-[10px] uppercase font-bold text-onedark-muted border-b border-onedark-borderMuted flex items-center justify-between">
            <span>EXPLORER // ARCHIVE</span>
            <Code2 className="w-3 h-3 text-onedark-muted" />
          </div>

          <div className="p-2 space-y-1 overflow-y-auto flex-1">
            {/* Folder: essays */}
            <div>
              <button
                type="button"
                onClick={() => toggleFolder("essays")}
                className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-onedark-textBright hover:bg-onedark-surface text-left transition-colors"
              >
                {openFolders.essays ? (
                  <ChevronDown className="w-3 h-3 text-onedark-muted" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-onedark-muted" />
                )}
                <Folder className="w-3.5 h-3.5 text-onedark-yellow" />
                <span className="font-semibold text-xs">essays/</span>
              </button>

              {openFolders.essays && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-onedark-borderMuted pl-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedFile("essays/Daughters_of_Misogyny.md")}
                    className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left text-xs transition-colors truncate ${
                      selectedFile === "essays/Daughters_of_Misogyny.md"
                        ? "bg-onedark-blue/20 text-onedark-blue font-semibold border border-onedark-blue/30"
                        : "text-onedark-text hover:bg-onedark-surface hover:text-onedark-textBright"
                    }`}
                  >
                    <FileText className="w-3 h-3 text-onedark-blue flex-shrink-0" />
                    <span className="truncate">Daughters_of_Misogyny.md</span>
                  </button>
                </div>
              )}
            </div>

            {/* Folder: poetry */}
            <div>
              <button
                type="button"
                onClick={() => toggleFolder("poetry")}
                className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-onedark-textBright hover:bg-onedark-surface text-left transition-colors"
              >
                {openFolders.poetry ? (
                  <ChevronDown className="w-3 h-3 text-onedark-muted" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-onedark-muted" />
                )}
                <Folder className="w-3.5 h-3.5 text-onedark-yellow" />
                <span className="font-semibold text-xs">poetry/</span>
              </button>

              {openFolders.poetry && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-onedark-borderMuted pl-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedFile("poetry/तस्वीरें_छोटी_होनी_चाहिए.txt")}
                    className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left text-xs transition-colors truncate ${
                      selectedFile === "poetry/तस्वीरें_छोटी_होनी_चाहिए.txt"
                        ? "bg-onedark-blue/20 text-onedark-blue font-semibold border border-onedark-blue/30"
                        : "text-onedark-text hover:bg-onedark-surface hover:text-onedark-textBright"
                    }`}
                  >
                    <FileText className="w-3 h-3 text-onedark-green flex-shrink-0" />
                    <span className="truncate">तस्वीरें_छोटी_होनी_चाहिए.txt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedFile("poetry/गंजे_लोगों_की_पंचायत.txt")}
                    className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left text-xs transition-colors truncate ${
                      selectedFile === "poetry/गंजे_लोगों_की_पंचायत.txt"
                        ? "bg-onedark-blue/20 text-onedark-blue font-semibold border border-onedark-blue/30"
                        : "text-onedark-text hover:bg-onedark-surface hover:text-onedark-textBright"
                    }`}
                  >
                    <FileText className="w-3 h-3 text-onedark-yellow flex-shrink-0" />
                    <span className="truncate">गंजे_लोगों_की_पंचायत.txt</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-2 border-t border-onedark-borderMuted text-[10px] text-onedark-muted">
            <span className="text-onedark-cyan font-bold">3 items</span> indexed
          </div>
        </div>

        {/* Right Column: Syntax-highlighted text reader with line numbers gutter */}
        <div className="flex-1 overflow-auto bg-onedark-dark p-4 flex font-mono leading-relaxed">
          {/* Gutter with line numbers */}
          <div className="flex flex-col text-right pr-4 select-none text-onedark-muted/60 border-r border-onedark-borderMuted flex-shrink-0">
            {currentItem.lines.map((_, i) => (
              <span key={i} className="leading-6 text-[11px]">
                {String(i + 1).padStart(2, "0")}
              </span>
            ))}
          </div>

          {/* Reader text body */}
          <div className="pl-4 flex-1 text-onedark-text text-[13px] leading-6 overflow-x-auto">
            {currentItem.lines.map((line, idx) => {
              // Basic syntax highlighting for markdown/txt
              if (line.startsWith("# ")) {
                return (
                  <div key={idx} className="font-bold text-onedark-purple text-base my-1">
                    {line}
                  </div>
                );
              }
              if (line.startsWith("> ")) {
                return (
                  <div key={idx} className="italic text-onedark-yellow pl-2 border-l-2 border-onedark-yellow/50 my-1">
                    {line}
                  </div>
                );
              }
              if (line.startsWith("// ")) {
                return (
                  <div key={idx} className="text-onedark-muted italic">
                    {line}
                  </div>
                );
              }
              if (line.startsWith("---")) {
                return (
                  <div key={idx} className="text-onedark-border my-2">
                    {line}
                  </div>
                );
              }
              if (line.startsWith("— ")) {
                return (
                  <div key={idx} className="text-onedark-cyan font-semibold mt-3">
                    {line}
                  </div>
                );
              }
              return (
                <div key={idx} className={line.trim() === "" ? "h-4" : ""}>
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vim bottom statusline */}
      <div className="h-6 bg-onedark-surface2 border-t border-onedark-border flex items-center justify-between px-3 text-[10px] select-none text-onedark-text">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 rounded bg-onedark-blue text-onedark-dark font-bold uppercase">
            NORMAL
          </span>
          <span className="text-onedark-textBright font-semibold truncate">
            {currentItem.title}
          </span>
        </div>
        <div className="flex items-center gap-4 text-onedark-muted">
          <span>unix</span>
          <span>utf-8</span>
          <span className="text-onedark-textBright">100% ☰ {currentItem.lines.length}/L</span>
        </div>
      </div>
    </div>
  );
};
