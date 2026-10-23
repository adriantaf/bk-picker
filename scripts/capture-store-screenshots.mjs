#!/usr/bin/env node
/**
 * Capture Microsoft Store listing screenshots at 1920×1080.
 *
 * Usage:
 *   node scripts/capture-store-screenshots.mjs
 *
 * Expects Vite on http://127.0.0.1:1420 (started by the npm script).
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "store/listing/screenshots");
const artifactDir = "/opt/cursor/artifacts/screenshots";
const baseUrl = process.env.STORE_SHOT_URL ?? "http://127.0.0.1:1420";

const SHOTS = [
  { id: "manual", file: "01-color-tab.png" },
  { id: "loupe", file: "02-loupe.png" },
  { id: "image", file: "03-image.png" },
  { id: "history", file: "04-history.png" },
  { id: "palettes", file: "05-palettes.png" },
  { id: "systems", file: "06-systems.png" },
  { id: "settings", file: "07-settings.png" },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {
      // retry
    }
    await sleep(400);
  }
  throw new Error(`Server not ready: ${url}`);
}

async function startVite() {
  const child = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1"], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, BROWSER: "none" },
    detached: true,
  });
  let log = "";
  child.stdout.on("data", (d) => {
    log += d.toString();
  });
  child.stderr.on("data", (d) => {
    log += d.toString();
  });
  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error("Vite exited early:\n", log);
    }
  });
  await waitForServer(`${baseUrl}/?storeShot=1`);
  return child;
}

function stopVite(child) {
  if (!child.pid) return;
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    try {
      child.kill("SIGKILL");
    } catch {
      // ignore
    }
  }
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(artifactDir, { recursive: true }).catch(() => undefined);

  const vite = await startVite();
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || "/usr/local/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });

    await page.goto(`${baseUrl}/?storeShot=1`, {
      waitUntil: "networkidle",
      timeout: 60_000,
    });
    await page.waitForFunction(
      () => document.documentElement.dataset.storeShotReady === "1",
      { timeout: 30_000 },
    );
    // Let fonts/layout settle
    await sleep(800);

    for (const shot of SHOTS) {
      await page.evaluate((id) => {
        document.documentElement.dataset.storeShotReady = "0";
        const apply = window.__bkApplyStoreShot;
        if (typeof apply !== "function") {
          throw new Error("__bkApplyStoreShot missing");
        }
        apply(id);
      }, shot.id);

      await page.waitForFunction(
        (id) =>
          document.documentElement.dataset.storeShot === id &&
          document.documentElement.dataset.storeShotReady === "1",
        shot.id,
        { timeout: 15_000 },
      );

      if (shot.id === "image") {
        await page.waitForFunction(
          () => {
            const canvas = document.querySelector(
              ".store-shot-content canvas",
            );
            return canvas && canvas.width > 10 && canvas.height > 10;
          },
          { timeout: 15_000 },
        );
        await page.evaluate(() => {
          const canvas = document.querySelector(".store-shot-content canvas");
          canvas?.scrollIntoView({ block: "center", inline: "nearest" });
        });
        await sleep(700);
      } else {
        await sleep(450);
      }

      // Disable animations for crisp frames
      await page.addStyleTag({
        content: `*, *::before, *::after { animation: none !important; transition: none !important; }`,
      });

      const target = path.join(outDir, shot.file);
      await page.screenshot({
        path: target,
        type: "png",
        clip: { x: 0, y: 0, width: 1920, height: 1080 },
      });
      const artifact = path.join(artifactDir, shot.file);
      await page.screenshot({
        path: artifact,
        type: "png",
        clip: { x: 0, y: 0, width: 1920, height: 1080 },
      });
      console.log("wrote", shot.file);
    }

    await writeFile(
      path.join(outDir, ".captured-at"),
      new Date().toISOString() + "\n",
    );
  } finally {
    await browser.close().catch(() => undefined);
    stopVite(vite);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
