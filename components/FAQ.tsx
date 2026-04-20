import { FAQS } from "./StructuredData";

export default function FAQ() {
  return (
    <section
      id="faq"
      className="relative px-6 md:px-10 py-24 md:py-32 bg-bg border-t border-border"
    >
      <div className="max-w-4xl mx-auto">
        <p className="text-[11px] tracking-[0.3em] uppercase text-fg-dim mb-4">
          Answers, fast
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-fg mb-4">
          Startup credits, <span className="gradient-text">explained</span>.
        </h2>
        <p className="text-fg-muted text-base md:text-lg max-w-2xl mb-14">
          Short, direct answers to the questions founders ask before applying. No fluff, no
          upsell.
        </p>

        <div className="space-y-10">
          {FAQS.map(({ q, a }, i) => (
            <article key={q} className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3">
              <span className="text-xs font-mono text-accent-1 pt-1.5 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-fg text-lg md:text-xl font-semibold tracking-tight mb-3 leading-tight">
                  {q}
                </h3>
                <p className="text-fg-muted text-[15px] leading-[1.75]">{a}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
