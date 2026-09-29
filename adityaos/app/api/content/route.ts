import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export interface ArchiveItemData {
  id: string;
  path: string;
  filename: string;
  title: string;
  category: string;
  extension: "md" | "txt";
  lines: string[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedPath = searchParams.get("path");

    // Base directory check: prioritize /content, fallback to /public/content
    let baseDir = path.join(process.cwd(), "content");
    if (!fs.existsSync(baseDir)) {
      baseDir = path.join(process.cwd(), "public", "content");
    }

    if (!fs.existsSync(baseDir)) {
      return NextResponse.json({ items: [] });
    }

    // If specific file requested
    if (requestedPath) {
      const sanitized = requestedPath.replace(/(\.\.[\/\\])+/g, "");
      const fullFilePath = path.join(baseDir, sanitized);
      if (fs.existsSync(fullFilePath)) {
        const raw = fs.readFileSync(fullFilePath, "utf-8");
        const lines = raw.split(/\r?\n/);
        return NextResponse.json({
          path: sanitized,
          lines,
        });
      }
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const items: ArchiveItemData[] = [];
    const entries = fs.readdirSync(baseDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const category = entry.name;
        const catDir = path.join(baseDir, category);
        const files = fs.readdirSync(catDir, { withFileTypes: true });

        for (const file of files) {
          if (file.isFile() && (file.name.endsWith(".md") || file.name.endsWith(".txt"))) {
            const filePath = path.join(catDir, file.name);
            const raw = fs.readFileSync(filePath, "utf-8");
            const lines = raw.split(/\r?\n/);

            // Extract title from first markdown header or comment or filename
            let title = file.name.replace(/\.(md|txt)$/, "").replace(/_/g, " ");
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("# ")) {
                title = trimmed.replace(/^#\s+/, "");
                break;
              } else if (trimmed.startsWith("// कविता:") || trimmed.startsWith("// व्यंग्य-कविता:")) {
                title = trimmed.replace(/^\/\/\s*(कविता:|व्यंग्य-कविता:)\s*/, "");
                break;
              }
            }

            const ext = file.name.endsWith(".md") ? "md" : "txt";
            const relPath = `${category}/${file.name}`;
            const id = file.name.toLowerCase().replace(/[^a-z0-9]/g, "-");

            items.push({
              id,
              path: relPath,
              filename: file.name,
              title,
              category,
              extension: ext,
              lines,
            });
          }
        }
      }
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error reading content directory:", error);
    return NextResponse.json({ error: "Failed to scan content" }, { status: 500 });
  }
}
