import "server-only";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { PROGRAMS as SEED, type Program } from "./programs";

type Snapshot = {
  refreshedAt: string;
  errors: { id: string; error: string }[];
  programs: Program[];
};

export type LoadedPrograms = {
  programs: Program[];
  refreshedAt: string | null;
};

// Runs at build time on the server. Missing data file is OK — seed is the fallback.
export function loadPrograms(): LoadedPrograms {
  const dataPath = resolve(process.cwd(), "data/programs.json");
  let snapshot: Snapshot | null = null;
  if (existsSync(dataPath)) {
    try {
      snapshot = JSON.parse(readFileSync(dataPath, "utf8")) as Snapshot;
    } catch {
      snapshot = null;
    }
  }

  if (!snapshot) return { programs: SEED, refreshedAt: null };

  const bySeedId = new Map(SEED.map((p) => [p.id, p]));
  const merged: Program[] = snapshot.programs.map((live) => {
    const seed = bySeedId.get(live.id);
    return { ...(seed ?? ({} as Program)), ...live };
  });
  const liveIds = new Set(merged.map((p) => p.id));
  for (const s of SEED) if (!liveIds.has(s.id)) merged.push(s);

  return { programs: merged, refreshedAt: snapshot.refreshedAt };
}

