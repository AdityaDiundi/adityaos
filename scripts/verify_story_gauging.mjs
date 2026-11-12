import { chromium } from "playwright-core";

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/home/aditya/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--use-gl=swiftshader",
      "--enable-webgl",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  console.log("Navigating to http://localhost:3000/story...");
  await page.goto("http://localhost:3000/story", { waitUntil: "networkidle" });

  await page.waitForSelector("canvas", { timeout: 10000 });
  await page.waitForTimeout(1000);

  // 1. Station 01 (Boot)
  await page.screenshot({
    path: "/home/aditya/.gemini/antigravity/brain/5790999c-3363-4f6e-933b-e053611b0f23/126_station_01_boot_gauged.png",
  });
  console.log("Captured 126_station_01_boot_gauged.png");

  // 2. Click pip for Station 2 (Arcade Days)
  const pip2 = page.locator('button[aria-label*="Station 2: Arcade Days"]');
  if (await pip2.isVisible()) {
    await pip2.click();
    await page.waitForTimeout(1800); // Allow camera spring to settle cleanly on plateau
    await page.screenshot({
      path: "/home/aditya/.gemini/antigravity/brain/5790999c-3363-4f6e-933b-e053611b0f23/127_station_02_arcade_gauged.png",
    });
    console.log("Captured 127_station_02_arcade_gauged.png");
  }

  // 3. Click pip for Station 4 (MFine Healthcare)
  const pip4 = page.locator('button[aria-label*="Station 4: MFine Healthcare"]');
  if (await pip4.isVisible()) {
    await pip4.click();
    await page.waitForTimeout(1800);
    await page.screenshot({
      path: "/home/aditya/.gemini/antigravity/brain/5790999c-3363-4f6e-933b-e053611b0f23/128_station_04_mfine_gauged.png",
    });
    console.log("Captured 128_station_04_mfine_gauged.png");
  }

  // 4. Click pip for Station 8 (Personal Builds)
  const pip8 = page.locator('button[aria-label*="Station 8: Personal Builds"]');
  if (await pip8.isVisible()) {
    await pip8.click();
    await page.waitForTimeout(1800);
    await page.screenshot({
      path: "/home/aditya/.gemini/antigravity/brain/5790999c-3363-4f6e-933b-e053611b0f23/129_station_08_builds_gauged.png",
    });
    console.log("Captured 129_station_08_builds_gauged.png");
  }

  await browser.close();
  console.log("Verification finished successfully!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
