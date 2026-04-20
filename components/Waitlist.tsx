"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || status === "success") return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          referrer: typeof document !== "undefined" ? document.referrer : undefined,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        setStatus("error");
        setError(body?.error || "Something went wrong. Try again.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Network error. Try again.");
    }
  }

  return (
    <section
      id="waitlist"
      className="relative px-6 md:px-10 py-24 md:py-28 border-y border-border overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at center, rgba(0,200,83,0.12) 0%, rgba(5,5,5,0) 60%)",
        }}
      />
      <div className="relative max-w-3xl mx-auto text-center">
        <p className="text-[11px] tracking-[0.3em] uppercase text-fg-dim mb-4">
          The weekly changelog
        </p>
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-fg leading-[1.05]">
          Know what <span className="gradient-text">changed</span>
          <br className="hidden md:block" /> before other founders do.
        </h2>
        <p className="mt-5 text-fg-muted text-base md:text-lg max-w-xl mx-auto">
          Every week we scan every program and ship a one-email digest: amounts up, amounts down,
          new launches, dead programs. No spam, no upsell, unsubscribe in one click.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 flex flex-col sm:flex-row items-stretch justify-center gap-2 max-w-md mx-auto"
        >
          <input
            type="email"
            required
            disabled={status === "loading" || status === "success"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@startup.com"
            className="flex-1 bg-bg-secondary border border-border rounded-full px-5 py-3 text-sm text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent-1/60 transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="gradient-cta px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:hover:scale-100 whitespace-nowrap"
          >
            {status === "loading"
              ? "Sending…"
              : status === "success"
                ? "You're in ✓"
                : "Join the waitlist"}
          </button>
        </form>

        <div className="mt-4 min-h-[1.25rem] text-xs">
          {status === "success" && (
            <p className="text-accent-1">
              You&apos;re on the list. First changelog ships soon.
            </p>
          )}
          {status === "error" && error && <p className="text-red-400">{error}</p>}
          {status === "idle" && (
            <p className="text-fg-dim">No credit card. Nothing to install. Just the digest.</p>
          )}
        </div>
      </div>
    </section>
  );
}
