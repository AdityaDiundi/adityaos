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
      "*Date: 26 May, 2026*",
      "*Author: Aditya Diundi*",
      "*Source: diundi.bearblog.dev/daughters-of-misogyny/*",
      "",
      "---",
      "",
      "*This world works in the strangest of the ways*",
      "*Girls are born to the most misogynistic of the men*",
      "*Some change, some remain the same*",
      "",
      "— Aditya",
    ],
  },
  "essays/On_Borrowed_Beliefs.md": {
    id: "beliefs",
    path: "essays/On_Borrowed_Beliefs.md",
    filename: "On_Borrowed_Beliefs.md",
    title: "On Borrowed Beliefs",
    category: "essays",
    extension: "md",
    lines: [
      "# On Borrowed Beliefs",
      "",
      "*Date: 01 Apr, 2026*",
      "*Author: Aditya Diundi*",
      "*Source: diundi.bearblog.dev/on-borrowed-beliefs/*",
      "",
      "---",
      "",
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
  "poetry/तस्वीरें_छोटी_होनी_चाहिए.txt": {
    id: "tasveerein",
    path: "poetry/तस्वीरें_छोटी_होनी_चाहिए.txt",
    filename: "तस्वीरें_छोटी_होनी_चाहिए.txt",
    title: "तस्वीरें छोटी होनी चाहिए",
    category: "poetry",
    extension: "txt",
    lines: [
      "// कविता: तस्वीरें छोटी होनी चाहिए",
      "// रचनाकार: आदित्य दियुंडी",
      "// स्रोत: diundi.bearblog.dev/3499/ (20 May, 2026)",
      "",
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
  "poetry/गंजे_लोगों_की_पंचायत.txt": {
    id: "panchayat",
    path: "poetry/गंजे_लोगों_की_पंचायत.txt",
    filename: "गंजे_लोगों_की_पंचायत.txt",
    title: "गंजे लोगों की पंचायत",
    category: "poetry",
    extension: "txt",
    lines: [
      "// व्यंग्य-कविता: गंजे लोगों की पंचायत",
      "// रचनाकार: आदित्य दियुंडी",
      "// स्रोत: diundi.bearblog.dev/6075/ (28 Mar, 2026)",
      "",
      "लोग बात बहुत करते हैं,",
      "मौका मिलते ही",
      "बातें चालू।",
      "",
      "काम का बना दिया है हलवा,",
      "और बातों का है असीम जलवा।",
      "",
      "मुद्दा सामने ही था,",
      "लेकिन पहले ज़रा किस्से-कहानी हो जाए।",
      "",
      "जाओ किसी कॉन्फ़्रेंस में — ज्ञान बहुत देंगे,",
      "जो नहीं आते ऐसी बैठकों में",
      "वो बहुत कम मिलेंगे।",
      "",
      "अरे, पर बातें भी तो ज़रूरी हैं,",
      "हम नहीं करेंगे तो कौन करेगा?",
      "",
      "जिनकी बातें हैं, वो करेंगे —",
      "एक नहीं, कई हज़ार हैं,",
      "और ना वैसा मंच है,",
      "ना उनके लिए कोई बाज़ार है।",
      "",
      "ग़रीब गंजा ही रह जाता है,",
      "अमीर बुढ़ापे में भी नए बाल लगवाता है।",
      "",
      "मैं भी बातें बहुत करता हूँ —",
      "काम, उससे भी कम।",
      "बाल मेरे भी नहीं हैं,",
      "और मिज़ाज सूरज से भी गरम।",
      "",
      "— आदित्य",
    ],
  },
  "poetry/नहीं_बुलाना.txt": {
    id: "nahi-bulana",
    path: "poetry/नहीं_बुलाना.txt",
    filename: "नहीं_बुलाना.txt",
    title: "नहीं बुलाना",
    category: "poetry",
    extension: "txt",
    lines: [
      "// कविता: नहीं बुलाना",
      "// रचनाकार: आदित्य दियुंडी",
      "// स्रोत: diundi.bearblog.dev/1925/ (03 Jun, 2026)",
      "",
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
  "poetry/The_Fire_I_Watered.md": {
    id: "fire-watered",
    path: "poetry/The_Fire_I_Watered.md",
    filename: "The_Fire_I_Watered.md",
    title: "The Fire I Watered",
    category: "poetry",
    extension: "md",
    lines: [
      "# The Fire I Watered",
      "",
      "*Date: 27 Mar, 2026*",
      "*Author: Aditya Diundi*",
      "*Source: diundi.bearblog.dev/the-fire-i-watered/*",
      "",
      "---",
      "",
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
              Curated essays, reflections, and poetry archives by Aditya Diundi.
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
