const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

async function record() {
  const videoDir = path.join(__dirname, "../public/video_temp");
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  console.log("Launching Chromium for real DOM screencast...");
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1.5,
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();
  console.log("Navigating to http://localhost:3000/pixel?demo=1 ...");
  await page.goto("http://localhost:3000/pixel?demo=1", { waitUntil: "networkidle" });

  // Let the automated showcase tour play through all 5 phases
  console.log("Recording live UI interactions (12.5 seconds)...");
  await page.waitForTimeout(12500);

  console.log("Tour finished. Closing browser context to flush video...");
  await page.close();
  await context.close();
  await browser.close();

  // Find the recorded webm file
  const files = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"));
  if (files.length === 0) {
    throw new Error("No webm video found in " + videoDir);
  }

  const rawVideoPath = path.join(videoDir, files[0]);
  const outMp4Path = path.join(__dirname, "../public/pixel_engine_showcase.mp4");
  const artifactPath = "/home/aditya/.gemini/antigravity/brain/5790999c-3363-4f6e-933b-e053611b0f23/pixel_engine_showcase.mp4";

  console.log(`Transcoding ${rawVideoPath} to high-definition H.264 MP4: ${outMp4Path} ...`);
  execSync(
    `ffmpeg -y -i "${rawVideoPath}" -c:v libx264 -pix_fmt yuv420p -preset medium -crf 19 "${outMp4Path}"`,
    { stdio: "inherit" }
  );

  fs.copyFileSync(outMp4Path, artifactPath);
  console.log("Copied to artifacts directory successfully!");

  // Clean up temp dir
  fs.rmSync(videoDir, { recursive: true, force: true });
  console.log("Done! Broadcast-ready video saved at:", outMp4Path);
}

record().catch((err) => {
  console.error("Recording error:", err);
  process.exit(1);
});
