const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

async function record() {
  const videoDir = path.join(__dirname, "../temp_raw_screencast");
  if (fs.existsSync(videoDir)) {
    fs.rmSync(videoDir, { recursive: true, force: true });
  }
  fs.mkdirSync(videoDir, { recursive: true });

  console.log("Launching Chromium for Noctalia Dark DOM Screencast...");
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();
  console.log("Navigating to http://localhost:3000/pixel?demo=1&theme=noctalia ...");
  await page.goto("http://localhost:3000/pixel?demo=1&theme=noctalia", { waitUntil: "networkidle" });

  console.log("Recording complete 14.5-second live showcase tour...");
  await page.waitForTimeout(14500);

  console.log("Tour finished. Closing browser context to save video...");
  await page.close();
  await context.close();
  await browser.close();

  const files = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"));
  if (files.length === 0) {
    throw new Error("No webm recorded!");
  }

  const rawPath = path.join(videoDir, files[0]);
  const destPath = path.join(__dirname, "../temp_raw_noctalia.webm");
  fs.copyFileSync(rawPath, destPath);
  console.log("Saved raw video to:", destPath);
}

record().catch((e) => {
  console.error(e);
  process.exit(1);
});
