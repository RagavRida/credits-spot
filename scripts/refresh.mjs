#!/usr/bin/env node
// Firecrawl-powered refresh: scrapes each program's official page,
// extracts current amount + eligibility, writes data/programs.json.
// Run: node scripts/refresh.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Load .env.local manually (no dotenv dep)
if (existsSync(resolve(ROOT, ".env.local"))) {
  const env = readFileSync(resolve(ROOT, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
}

const API_KEY = process.env.FIRECRAWL_API_KEY;
if (!API_KEY) {
  console.error("FIRECRAWL_API_KEY missing. Put it in .env.local.");
  process.exit(1);
}

const SEED = await loadSeed();
console.log(`Refreshing ${SEED.length} programs via Firecrawl…`);

const schema = {
  type: "object",
  properties: {
    currentAmount: {
      type: "string",
      description:
        "The HEADLINE credit or perk amount for the startup program — the biggest, most-prominent number on the page that represents what a startup receives. Examples: 'Up to $100,000', 'Up to $350,000 over 2 years', '₹30,00,000+ in benefits'. Ignore unrelated discounts, annual savings figures, or pricing for other products. Return the string exactly as the page presents it. Return empty string if no startup-program amount is stated.",
    },
    eligibilityNotes: {
      type: "string",
      description:
        "Who qualifies, in one short sentence. Look for: funding stage (pre-Seed, pre-Series A), company age (under X years), geography, DPIIT/government recognition, required VC/accelerator partnership, or revenue caps. Under 140 chars. Empty string if nothing specific is stated.",
    },
    programSummary: {
      type: "string",
      description:
        "One concise sentence describing what the startup program actually offers and to whom. Under 160 chars. No marketing fluff, no 'learn more'.",
    },
  },
  required: ["currentAmount", "eligibilityNotes", "programSummary"],
  additionalProperties: false,
};

const results = [];
const errors = [];

// Run with small concurrency to be polite
const CONCURRENCY = 4;
const queue = [...SEED];
const active = new Set();

async function worker() {
  while (queue.length) {
    const program = queue.shift();
    if (!program) break;
    const p = refreshOne(program)
      .then((updated) => {
        results.push(updated);
        const ok = updated.verifiedAmount ? "✓" : "–";
        console.log(`${ok} ${updated.name} — ${updated.verifiedAmount || "no amount found"}`);
      })
      .catch((err) => {
        errors.push({ id: program.id, error: err.message });
        console.log(`✗ ${program.name} — ${err.message}`);
        results.push(program);
      })
      .finally(() => active.delete(p));
    active.add(p);
    if (active.size >= CONCURRENCY) await Promise.race(active);
  }
  await Promise.all(active);
}

await worker();

results.sort(
  (a, b) => SEED.findIndex((s) => s.id === a.id) - SEED.findIndex((s) => s.id === b.id),
);

const outDir = resolve(ROOT, "data");
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, "programs.json");
writeFileSync(
  outPath,
  JSON.stringify(
    {
      refreshedAt: new Date().toISOString(),
      errors,
      programs: results,
    },
    null,
    2,
  ),
);

console.log(
  `\nWrote ${outPath}\n  ${results.length} programs, ${errors.length} errors, ${results.filter((r) => r.verifiedAmount).length} amounts verified`,
);

// ── helpers ────────────────────────────────────────────────────────────────

async function refreshOne(program) {
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: program.officialUrl,
      formats: [
        {
          type: "json",
          schema,
          prompt: `You are extracting data about the "${program.name}" STARTUP program. The headline credit amount is usually the single biggest dollar/INR figure prominently associated with the program (e.g. "Up to $100,000 in AWS credits" or "₹30,00,000+ in benefits"). DO NOT pick small side-figures like "save $X/year", one-off discounts, or unrelated product pricing. If the page is a 404, login gate, or doesn't describe the program, return empty strings.`,
        },
      ],
      onlyMainContent: true,
      waitFor: 1500,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  const body = await res.json();
  if (!body.success) {
    throw new Error(body.error || "firecrawl returned success=false");
  }

  const json = body.data?.json;
  if (!json) {
    return { ...program, lastVerified: new Date().toISOString() };
  }

  return {
    ...program,
    lastVerified: new Date().toISOString(),
    verifiedAmount: clean(json.currentAmount),
    verifiedNotes: clean(json.programSummary),
    ...(clean(json.eligibilityNotes) ? { eligibility: clean(json.eligibilityNotes) } : {}),
  };
}

function clean(v) {
  if (v == null) return undefined;
  const s = String(v).trim();
  if (!s || s.toLowerCase() === "null" || s.toLowerCase() === "none") return undefined;
  // Drop non-answer boilerplate
  const low = s.toLowerCase();
  if (
    low.includes("not specified") ||
    low.includes("not stated") ||
    low.includes("not mentioned") ||
    low.includes("not provided") ||
    low.includes("unspecified") ||
    low.includes("not available")
  ) {
    return undefined;
  }
  return s;
}

async function loadSeed() {
  // Read the TS file via a tiny eval — avoids adding a TS runner dep
  const src = readFileSync(resolve(ROOT, "lib/programs.ts"), "utf8");
  const start = src.indexOf("export const PROGRAMS");
  const open = src.indexOf("[", start);
  const close = src.lastIndexOf("];");
  if (start === -1 || open === -1 || close === -1) {
    throw new Error("Could not locate PROGRAMS array in lib/programs.ts");
  }
  const arrayLiteral = src.slice(open, close + 1);
  // JS eval — safe because we own the source
  const programs = new Function(`return ${arrayLiteral}`)();
  return programs;
}
