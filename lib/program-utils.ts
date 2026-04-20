import type { Program } from "./programs";

export function displayAmount(p: Program): string {
  return p.verifiedAmount || p.amount;
}

export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "from curated list";
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
