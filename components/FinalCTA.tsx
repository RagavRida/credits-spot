export default function FinalCTA() {
  return (
    <section className="relative px-6 md:px-10 py-32 md:py-40 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,200,83,0.08) 0%, rgba(5,5,5,0) 60%)",
        }}
      />
      <div className="relative max-w-3xl mx-auto text-center">
        <p className="text-[11px] tracking-[0.3em] uppercase text-fg-dim mb-5">Last thing</p>
        <h2 className="text-5xl md:text-7xl font-semibold tracking-tight text-fg leading-[1.05]">
          Eligibility and amounts <span className="gradient-text">change monthly</span>.
        </h2>
        <p className="mt-6 text-fg-muted text-base md:text-lg max-w-xl mx-auto">
          Always verify on each program&apos;s page before applying. Click any card to jump to the
          official source.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="#waitlist"
            className="gradient-cta px-7 py-3 rounded-full text-sm font-medium tracking-wide hover:scale-[1.02] transition-transform"
          >
            Get the weekly changelog
          </a>
          <a
            href="#directory"
            className="text-fg-muted hover:text-fg text-sm tracking-wide transition-colors"
          >
            Back to directory ↑
          </a>
        </div>
      </div>
    </section>
  );
}
