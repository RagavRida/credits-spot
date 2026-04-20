"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, CATEGORY_ACCENT, type Category, type Program } from "@/lib/programs";
import { displayAmount, relativeTime } from "@/lib/program-utils";

type Props = {
  programs: Program[];
  refreshedAt: string | null;
};

export default function Directory({ programs, refreshedAt }: Props) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<Category | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programs.filter((p) => {
      if (activeCat !== "All" && p.category !== activeCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.goodFor.toLowerCase().includes(q) ||
        (p.verifiedNotes?.toLowerCase().includes(q) ?? false) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, activeCat, programs]);

  const verifiedCount = programs.filter((p) => p.verifiedAmount).length;

  return (
    <section id="directory" className="relative px-6 md:px-10 py-24 md:py-32 bg-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-fg-dim mb-3">
              The directory
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-fg">
              Every program, <span className="gradient-text">searchable</span>.
            </h2>
            <p className="mt-4 text-fg-muted max-w-xl">
              {programs.length} curated programs.{" "}
              <span className="text-accent-1">{verifiedCount} auto-verified</span> via Firecrawl —
              data refreshed <span className="text-fg">{relativeTime(refreshedAt)}</span>.
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-80">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search AWS, AI, India…"
              className="w-full bg-bg-secondary border border-border rounded-full px-5 py-3 text-sm text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent-1/60 transition-colors"
            />
          </div>
        </div>

        <div id="categories" className="flex flex-wrap gap-2 mb-10">
          <FilterChip
            label={`All · ${programs.length}`}
            active={activeCat === "All"}
            onClick={() => setActiveCat("All")}
          />
          {CATEGORIES.map((cat) => {
            const count = programs.filter((p) => p.category === cat).length;
            if (count === 0) return null;
            return (
              <FilterChip
                key={cat}
                label={`${cat} · ${count}`}
                active={activeCat === cat}
                accent={CATEGORY_ACCENT[cat]}
                onClick={() => setActiveCat(cat)}
              />
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-fg-muted text-sm">
            No programs match. Try a different search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FilterChip({
  label,
  active,
  accent,
  onClick,
}: {
  label: string;
  active: boolean;
  accent?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs tracking-wide border transition-all ${
        active
          ? "bg-fg text-bg border-fg"
          : "bg-bg-secondary text-fg-muted border-border hover:text-fg hover:border-fg/30"
      }`}
      style={active && accent ? { background: accent, borderColor: accent, color: "#050505" } : undefined}
    >
      {label}
    </button>
  );
}

function ProgramCard({ program }: { program: Program }) {
  const accent = CATEGORY_ACCENT[program.category];
  const verified = Boolean(program.verifiedAmount);
  const description = program.verifiedNotes || program.description;

  return (
    <a
      href={program.officialUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col p-6 rounded-xl bg-bg-secondary border border-border hover:border-fg/20 transition-all"
    >
      <div
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full"
          style={{ color: accent, background: `${accent}15`, border: `1px solid ${accent}30` }}
        >
          {program.category}
        </span>
        <div className="flex items-center gap-2">
          {verified && (
            <span
              className="text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded-full text-accent-1 border border-accent-1/30 bg-accent-1/10"
              title={program.lastVerified ? `Verified ${relativeTime(program.lastVerified)}` : "Verified"}
            >
              ● live
            </span>
          )}
          <span className="text-[11px] text-fg-dim group-hover:text-fg transition-colors">↗</span>
        </div>
      </div>

      <h3 className="text-fg text-lg font-semibold tracking-tight mb-2">{program.name}</h3>
      <p className="text-2xl font-semibold tracking-tight mb-3" style={{ color: accent }}>
        {displayAmount(program)}
      </p>
      <p className="text-fg-muted text-sm leading-relaxed mb-4 flex-1">{description}</p>

      <div className="pt-4 border-t border-border space-y-1.5">
        <p className="text-[11px] text-fg-dim">
          <span className="text-fg-muted">Good for:</span> {program.goodFor}
        </p>
        {program.eligibility && (
          <p className="text-[11px] text-fg-dim">
            <span className="text-fg-muted">Eligibility:</span> {program.eligibility}
          </p>
        )}
      </div>
    </a>
  );
}
