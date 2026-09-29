import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export interface GalleryImage {
  id: string;
  name: string;
  filename: string;
  url: string;
  size: string;
  date: string;
}

export async function GET() {
  try {
    const galleryDir = path.join(process.cwd(), "public", "gallery");

    if (!fs.existsSync(galleryDir)) {
      return NextResponse.json({ images: [] });
    }

    const validExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"];
    const files = fs.readdirSync(galleryDir);

    const images: GalleryImage[] = files
      .filter((file) => validExtensions.some((ext) => file.toLowerCase().endsWith(ext)))
      .map((file) => {
        const filePath = path.join(galleryDir, file);
        const stats = fs.statSync(filePath);
        const sizeKb = Math.round(stats.size / 1024);
        const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

        const name = file
          .replace(/\.[^/.]+$/, "")
          .replace(/[_-]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return {
          id: file.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          name,
          filename: file,
          url: `/gallery/${encodeURIComponent(file)}`,
          size: sizeStr,
          date: stats.mtime.toISOString().split("T")[0],
        };
      });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error reading gallery directory:", error);
    return NextResponse.json({ error: "Failed to scan gallery" }, { status: 500 });
  }
}
