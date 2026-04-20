export default function Footer() {
  return (
    <footer className="border-t border-border px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-fg-dim text-xs tracking-wide">
          © {new Date().getFullYear()} CreditsSpot. Amounts and eligibility change often.
        </p>
        <p className="text-fg-dim text-xs tracking-wide">
          Not affiliated with any listed program.
        </p>
      </div>
    </footer>
  );
}
