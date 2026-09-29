"use client";

import React, { useState, useEffect } from "react";
import { Folder, FileText, ChevronRight, ChevronDown, Code2, RefreshCw, FolderPlus } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";

export interface ArchiveItem {
  id: string;
  path: string;
  filename: string;
  title: string;
  category: string;
  extension: "md" | "txt";
  lines: string[];
}

const FALLBACK_ARCHIVE_DATA: Record<string, ArchiveItem> = {
  "essays/Daughters_of_Misogyny.md": {
    id: "daughters",
    path: "essays/Daughters_of_Misogyny.md",
    filename: "Daughters_of_Misogyny.md",
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
      "",
      "— Aditya",
    ],
  },
  "poetry/तस्वीरें_छोटी_होनी_चाहिए.txt": {
    id: "tasveerein",
    path: "poetry/तस्वीरें_छोटी_होनी_चाहिए.txt",
    filename: "तस्वीरें_छोटी_होनी_चाहिए.txt",
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
    filename: "गंजे_लोगों_की_पंचायत.txt",
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
  const { activeTheme } = useThemeStore();
  const { playScrollNote, playClickChime } = useSoundStore();

  const [archiveMap, setArchiveMap] = useState<Record<string, ArchiveItem>>(FALLBACK_ARCHIVE_DATA);
  const [selectedFile, setSelectedFile] = useState<string>("essays/Daughters_of_Misogyny.md");
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    essays: true,
    poetry: true,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchContentFromApi = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          const newMap: Record<string, ArchiveItem> = {};
          data.items.forEach((item: ArchiveItem) => {
            newMap[item.path] = item;
          });
          setArchiveMap(newMap);
          // Auto-select first item if current selection not present
          if (!newMap[selectedFile] && data.items[0]) {
            setSelectedFile(data.items[0].path);
          }
        }
      }
    } catch {
      // Keep fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContentFromApi();
  }, []);

  const toggleFolder = (folder: string) => {
    playClickChime(420);
    setOpenFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  const currentItem =
    archiveMap[selectedFile] ||
    Object.values(archiveMap)[0] ||
    FALLBACK_ARCHIVE_DATA["essays/Daughters_of_Misogyny.md"];

  const categories = Array.from(new Set(Object.values(archiveMap).map((i) => i.category)));

  return (
    <div
      onWheel={(e) => playScrollNote(e.deltaY)}
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
      className="flex flex-col h-full select-text font-mono text-xs overflow-hidden"
    >
      {/* Nano/Vim top buffer tabs */}
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
          color: activeTheme.textPrimary,
        }}
        className="h-7 border-b flex items-center justify-between px-3 text-[11px] select-none flex-shrink-0"
      >
        <div className="flex items-center gap-2 truncate">
          <span
            style={{
              backgroundColor: `${activeTheme.accent}20`,
              color: activeTheme.accent,
            }}
            className="px-1.5 py-0.5 rounded text-[10px] font-bold"
          >
            VIM
          </span>
          <span className="font-semibold truncate">
            {currentItem.path}
          </span>
          <span style={{ color: activeTheme.textMuted }}>[RO]</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchContentFromApi}
            title="Reload content from content/ folder"
            style={{ color: activeTheme.accent }}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity text-[10px]"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">SYNC FOLDER</span>
          </button>

          <div style={{ color: activeTheme.textMuted }} className="hidden sm:flex items-center gap-3 text-[10px]">
            <span>utf-8</span>
            <span>markdown/txt</span>
            <span>lines: {currentItem.lines.length}</span>
          </div>
        </div>
      </div>

      {/* Main 2-column flexbox */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Directory Tree (Nvim Tree style) */}
        <div
          style={{
            backgroundColor: activeTheme.cardBg,
            borderColor: activeTheme.cardBorder,
          }}
          className="w-56 md:w-64 border-r flex flex-col flex-shrink-0 select-none"
        >
          <div
            style={{
              borderColor: activeTheme.headerBorder,
              color: activeTheme.textMuted,
            }}
            className="px-3 py-2 text-[10px] uppercase font-bold border-b flex items-center justify-between"
          >
            <span>EXPLORER // CONTENT</span>
            <Code2 className="w-3 h-3" />
          </div>

          <div className="p-2 space-y-1 overflow-y-auto flex-1">
            {categories.map((cat) => {
              const catItems = Object.values(archiveMap).filter((i) => i.category === cat);
              const isFolderOpen = openFolders[cat] ?? true;
              return (
                <div key={cat}>
                  <button
                    type="button"
                    onClick={() => toggleFolder(cat)}
                    className="w-full flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 text-left transition-colors"
                  >
                    {isFolderOpen ? (
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    ) : (
                      <ChevronRight className="w-3 h-3 opacity-60" />
                    )}
                    <Folder className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-xs">{cat}/</span>
                  </button>

                  {isFolderOpen && (
                    <div
                      style={{ borderColor: activeTheme.headerBorder }}
                      className="ml-4 mt-0.5 space-y-0.5 border-l pl-1.5"
                    >
                      {catItems.map((item) => {
                        const isSelected = selectedFile === item.path;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              playClickChime(500);
                              setSelectedFile(item.path);
                            }}
                            style={{
                              backgroundColor: isSelected ? `${activeTheme.accent}25` : "transparent",
                              borderColor: isSelected ? activeTheme.accent : "transparent",
                              color: isSelected ? activeTheme.accent : activeTheme.textPrimary,
                            }}
                            className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left text-xs transition-colors truncate border ${
                              isSelected ? "font-semibold" : "hover:bg-white/5 opacity-80 hover:opacity-100"
                            }`}
                          >
                            <FileText
                              className="w-3 h-3 flex-shrink-0"
                              style={{ color: isSelected ? activeTheme.accent : activeTheme.textMuted }}
                            />
                            <span className="truncate">{item.filename}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* GitHub Instruction footer */}
          <div
            style={{
              borderColor: activeTheme.headerBorder,
              color: activeTheme.textMuted,
            }}
            className="p-2.5 border-t text-[10px] space-y-1"
          >
            <div className="flex items-center justify-between font-bold">
              <span>{Object.keys(archiveMap).length} items indexed</span>
              <FolderPlus className="w-3 h-3 text-emerald-400" />
            </div>
            <p className="opacity-70 text-[9px] leading-tight">
              Add <code className="text-cyan-400">.md</code> files into <code className="text-cyan-400">content/essays/</code> via Git to publish instantly.
            </p>
          </div>
        </div>

        {/* Right Column: Syntax-highlighted text reader with line numbers gutter */}
        <div
          style={{
            backgroundColor: activeTheme.windowBg,
          }}
          className="flex-1 overflow-auto p-4 flex font-mono leading-relaxed"
        >
          {/* Gutter with line numbers */}
          <div
            style={{
              borderColor: activeTheme.headerBorder,
              color: activeTheme.textMuted,
            }}
            className="flex flex-col text-right pr-4 select-none opacity-50 border-r flex-shrink-0"
          >
            {currentItem.lines.map((_, i) => (
              <span key={i} className="leading-6 text-[11px]">
                {String(i + 1).padStart(2, "0")}
              </span>
            ))}
          </div>

          {/* Reader text body */}
          <div className="pl-4 flex-1 text-[13px] leading-6 overflow-x-auto" style={{ color: activeTheme.textPrimary }}>
            {currentItem.lines.map((line, idx) => {
              if (line.startsWith("# ")) {
                return (
                  <div key={idx} style={{ color: activeTheme.accent }} className="font-bold text-base my-1">
                    {line}
                  </div>
                );
              }
              if (line.startsWith("> ")) {
                return (
                  <div
                    key={idx}
                    style={{ borderColor: activeTheme.accent }}
                    className="italic text-amber-300 pl-2 border-l-2 my-1 opacity-90"
                  >
                    {line}
                  </div>
                );
              }
              if (line.startsWith("// ")) {
                return (
                  <div key={idx} style={{ color: activeTheme.textMuted }} className="italic">
                    {line}
                  </div>
                );
              }
              if (line.startsWith("---")) {
                return (
                  <div key={idx} style={{ borderColor: activeTheme.headerBorder }} className="border-b my-2"></div>
                );
              }
              if (line.startsWith("— ")) {
                return (
                  <div key={idx} style={{ color: activeTheme.accent }} className="font-semibold mt-3">
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
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
          color: activeTheme.textPrimary,
        }}
        className="h-6 border-t flex items-center justify-between px-3 text-[10px] select-none flex-shrink-0"
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              backgroundColor: activeTheme.accent,
              color: activeTheme.isDark ? "#000" : "#fff",
            }}
            className="px-1.5 py-0.2 rounded font-bold uppercase"
          >
            NORMAL
          </span>
          <span className="font-semibold truncate">
            {currentItem.title}
          </span>
        </div>
        <div style={{ color: activeTheme.textMuted }} className="flex items-center gap-4">
          <span>unix</span>
          <span>utf-8</span>
          <span>100% ☰ {currentItem.lines.length}/L</span>
        </div>
      </div>
    </div>
  );
};
