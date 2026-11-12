import { chromium } from "playwright-core";
import fs from "fs";

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

  // Wait for canvas
  await page.waitForSelector("canvas", { timeout: 10000 });
  await page.waitForTimeout(1000);

  // 1. Capture base state with 3D Viewport HUD
  await page.screenshot({
    path: "/home/aditya/.gemini/antigravity/brain/5790999c-3363-4f6e-933b-e053611b0f23/122_viewport_hud_ready.png",
  });
  console.log("Captured 122_viewport_hud_ready.png");

  // 2. Open help menu in HUD
  const helpBtn = page.locator('button[title="Viewport Shortcuts Help"]');
  if (await helpBtn.isVisible()) {
    await helpBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: "/home/aditya/.gemini/antigravity/brain/5790999c-3363-4f6e-933b-e053611b0f23/123_viewport_hud_shortcuts.png",
    });
    console.log("Captured 123_viewport_hud_shortcuts.png");
    await helpBtn.click(); // close help
    await page.waitForTimeout(200);
  }

  // 3. Test interactive 3D orbit via pointer drag on canvas
  const canvasBox = await page.locator("canvas").boundingBox();
  if (canvasBox) {
    const startX = canvasBox.x + canvasBox.width / 2;
    const startY = canvasBox.y + canvasBox.height / 2;

    // Drag to orbit horizontally and vertically
    await page.mouse.move(startX, startY);
    await page.mouse.down({ button: "left" });
    await page.mouse.move(startX + 220, startY - 80, { steps: 10 });
    await page.mouse.up({ button: "left" });
    await page.waitForTimeout(500);

    // Zoom in using [+] button
    const zoomInBtn = page.locator('button[title*="Zoom In"]');
    if (await zoomInBtn.isVisible()) {
      await zoomInBtn.click();
      await page.waitForTimeout(200);
      await zoomInBtn.click();
      await page.waitForTimeout(300);
    }

    await page.screenshot({
      path: "/home/aditya/.gemini/antigravity/brain/5790999c-3363-4f6e-933b-e053611b0f23/124_orbited_3d_viewport.png",
    });
    console.log("Captured 124_orbited_3d_viewport.png");

    // Click RESET button to restore camera
    const resetBtn = page.locator('button[title*="Reset Camera"]');
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: "/home/aditya/.gemini/antigravity/brain/5790999c-3363-4f6e-933b-e053611b0f23/125_camera_reset_restored.png",
      });
      console.log("Captured 125_camera_reset_restored.png");
    }
  }

  await browser.close();
  console.log("All viewport tests completed successfully.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
