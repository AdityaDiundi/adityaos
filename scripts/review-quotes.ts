#!/usr/bin/env node

/**
 * scripts/review-quotes.ts
 *
 * Interactive CLI tool to review, approve, edit, or reject candidate quotes.
 * Usage: node --experimental-strip-types scripts/review-quotes.ts
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import type { Quote } from "./extract-quotes.ts";

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, "data");
const CANDIDATES_FILE = path.join(DATA_DIR, "quotes.candidates.json");
const APPROVED_FILE = path.join(DATA_DIR, "quotes.json");

function loadJson<T>(file: string, fallback: T): T {
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function review() {
  const candidates: Quote[] = loadJson(CANDIDATES_FILE, []);
  let approved: Quote[] = loadJson(APPROVED_FILE, []);

  console.log(`\n=== ADITYA OS QUOTE REVIEW TOOL ===`);
  console.log(`Approved: ${approved.length} | Candidates: ${candidates.length}\n`);

  if (candidates.length === 0) {
    console.log("No candidates found! Run npm run quotes:extract first.");
    return;
  }

  const approvedIds = new Set(approved.map((q) => q.id));
  const unreviewed = candidates.filter((c) => !approvedIds.has(c.id));

  console.log(`Unreviewed candidates remaining: ${unreviewed.length}`);
  console.log(`Commands: [a]pprove, [s]kip, [e]dit, [q]uit\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const promptUser = (q: string): Promise<string> =>
    new Promise((resolve) => rl.question(q, resolve));

  for (let i = 0; i < unreviewed.length; i++) {
    const item = unreviewed[i];
    console.log(`\n------------------------------------------------------------`);
    console.log(`[${i + 1}/${unreviewed.length}] Source: "${item.sourceTitle}" (${item.lang.toUpperCase()})`);
    console.log(`"${item.text}"`);
    console.log(`Length: ${item.text.length} | Score: ${item.score}`);

    const answer = (await promptUser("Action [a/s/e/q]: ")).trim().toLowerCase();

    if (answer === "a" || answer === "y") {
      item.approved = true;
      approved.push(item);
      fs.writeFileSync(APPROVED_FILE, JSON.stringify(approved, null, 2), "utf8");
      console.log(`✓ Approved! (Total approved: ${approved.length})`);
    } else if (answer === "e") {
      const newText = await promptUser("Enter edited text: ");
      if (newText.trim().length >= 40) {
        item.text = newText.trim();
        item.approved = true;
        approved.push(item);
        fs.writeFileSync(APPROVED_FILE, JSON.stringify(approved, null, 2), "utf8");
        console.log(`✓ Edited and approved!`);
      } else {
        console.log("Too short, discarded edit.");
      }
    } else if (answer === "q") {
      console.log("\nExiting review. Progress saved.");
      break;
    } else {
      console.log("Skipped.");
    }
  }

  rl.close();
}

review().catch((err) => {
  console.error(err);
  process.exit(1);
});
