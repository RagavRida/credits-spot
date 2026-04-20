const TIPS = [
  {
    n: "01",
    title: "Pick one primary cloud.",
    body: "AWS, GCP, Azure, DO, or OVH. Don't spread infra across three providers just because you have credits — the ops tax eats the savings.",
  },
  {
    n: "02",
    title: "Centralise analytics early.",
    body: "Wire PostHog or Mixpanel plus a real database (Mongo, Postgres) before launch. Flying blind after Day 1 is the most expensive mistake.",
  },
  {
    n: "03",
    title: "Standardise on one productivity stack.",
    body: "Notion plus Slack plus Miro. Don't scatter the team across eight tools — context-switching kills velocity faster than bad code.",
  },
  {
    n: "04",
    title: "CRM & support when traction lands.",
    body: "HubSpot, Freshworks, or Zoho the moment early customers start repeating questions. Cracks show up fast once you're past 20 users.",
  },
  {
    n: "05",
    title: "Save ad credits for a working funnel.",
    body: "Don't burn free Google or Meta ads on an untested landing page. Validate conversion organically first — credits are finite, lessons aren't.",
  },
];

export default function Strategy() {
  return (
    <section id="strategy" className="relative px-6 md:px-10 py-24 md:py-32 bg-bg-secondary border-y border-border">
      <div className="max-w-5xl mx-auto">
        <p className="text-[11px] tracking-[0.3em] uppercase text-fg-dim mb-3">
          How to actually use these
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-fg mb-12">
          Credits don&apos;t build companies. <span className="gradient-text">Discipline does.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {TIPS.map((tip) => (
            <div key={tip.n} className="flex gap-5">
              <span className="text-xs font-mono text-accent-1 pt-1.5">{tip.n}</span>
              <div>
                <h3 className="text-fg text-lg font-semibold tracking-tight mb-2">{tip.title}</h3>
                <p className="text-fg-muted text-sm leading-relaxed">{tip.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
