import ChangelogEmail, { type ChangelogPayload } from "@/components/email/ChangelogEmail";

export const metadata = {
  title: "Preview · Changelog #042",
  robots: { index: false, follow: false },
};

const SAMPLE: ChangelogPayload = {
  issueNumber: 42,
  weekOf: "April 20, 2026",
  siteUrl: "https://creditsspot.com",
  unsubscribeUrl: "https://creditsspot.com/unsubscribe?t=demo",
  changes: [
    {
      kind: "amount",
      id: "gcp",
      name: "Google for Startups Cloud",
      category: "Cloud & Infra",
      from: "Up to $200,000",
      to: "Up to $350,000 over 2 years",
      direction: "up",
      note: "AI-first startups now get the expanded tier unlocked directly — no VC intro required. Old $200K tier still exists for non-AI products.",
    },
    {
      kind: "amount",
      id: "posthog",
      name: "PostHog for Startups",
      category: "Dev Tools",
      from: "$50,000",
      to: "$75,000",
      direction: "up",
      note: "Quietly bumped after the 2025 credit expansion. Funding cap raised from $5M to $10M raised.",
    },
    {
      kind: "amount",
      id: "mongodb",
      name: "MongoDB for Startups",
      category: "Dev Tools",
      from: "$500 Atlas credits",
      to: "$5,000 Atlas + AI tokens",
      direction: "up",
      note: "10x bump. New tier includes Vector Search credits and Voyage AI model tokens — relevant if you're on RAG.",
    },
    {
      kind: "new",
      id: "vercel-startups",
      name: "Vercel for Startups",
      category: "Cloud & Infra",
      amount: "Up to $2,400/yr Pro plan free",
      note: "Newly launched program aimed at seed-stage teams shipping on Next.js. Includes edge compute and KV credits. Apply via any partner VC.",
      officialUrl: "https://vercel.com/startups",
    },
    {
      kind: "new",
      id: "supabase-startups",
      name: "Supabase Startup Program",
      category: "Dev Tools",
      amount: "$5,000 + 12mo Team plan",
      note: "Postgres-first stack credit. Good pairing if you're running away from Firebase pricing at scale.",
      officialUrl: "https://supabase.com/startups",
    },
    {
      kind: "dead",
      id: "heroku-startups",
      name: "Heroku Startup Program",
      category: "Cloud & Infra",
      lastAmount: "$50,000 Dynos + add-ons",
      note: "Salesforce officially retired the program. Existing credits honored through Q3, no new acceptances.",
    },
  ],
};

export default function ChangelogPreview() {
  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "24px 16px 8px",
          color: "rgba(255,255,255,0.6)",
          fontSize: 12,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
          letterSpacing: "0.02em",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          <span style={{ color: "#00c853" }}>●</span> Email preview · Changelog #{SAMPLE.issueNumber}
        </span>
        <a href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
          ← Back to site
        </a>
      </div>
      <ChangelogEmail payload={SAMPLE} />
    </div>
  );
}
