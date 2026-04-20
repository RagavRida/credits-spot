import type { Category } from "@/lib/programs";
import { CATEGORY_ACCENT } from "@/lib/programs";

export type AmountChange = {
  kind: "amount";
  id: string;
  name: string;
  category: Category;
  from: string;
  to: string;
  direction: "up" | "down";
  note?: string;
};

export type NewProgram = {
  kind: "new";
  id: string;
  name: string;
  category: Category;
  amount: string;
  note: string;
  officialUrl: string;
};

export type DeadProgram = {
  kind: "dead";
  id: string;
  name: string;
  category: Category;
  lastAmount: string;
  note?: string;
};

export type ChangelogPayload = {
  issueNumber: number;
  weekOf: string; // "April 20, 2026"
  siteUrl: string; // "https://creditsspot.com"
  unsubscribeUrl: string;
  changes: (AmountChange | NewProgram | DeadProgram)[];
};

// Email-safe constants. Inline styles only; no Tailwind in the email body.
const BG = "#050505";
const CARD = "#0a0a0c";
const BORDER = "rgba(255,255,255,0.08)";
const FG = "rgba(255,255,255,0.92)";
const FG_MUTED = "rgba(255,255,255,0.62)";
const FG_DIM = "rgba(255,255,255,0.38)";
const ACCENT_1 = "#00c853";
const ACCENT_2 = "#ffd54f";
const UP = "#00c853";
const DOWN = "#ff4d4d";

const BASE_FONT = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif";

// Renders just the email body markup (no html/head/body wrapper).
// For actual sending, wrap with <html><body>…</body></html> at the send-time layer.
export default function ChangelogEmail({ payload }: { payload: ChangelogPayload }) {
  const { changes } = payload;
  const amountChanges = changes.filter((c): c is AmountChange => c.kind === "amount");
  const newOnes = changes.filter((c): c is NewProgram => c.kind === "new");
  const dead = changes.filter((c): c is DeadProgram => c.kind === "dead");

  const summary = buildSummary(amountChanges.length, newOnes.length, dead.length);

  return (
    <table
      role="presentation"
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      style={{ background: BG, padding: "40px 16px", fontFamily: BASE_FONT }}
    >
      <tbody>
        <tr>
          <td align="center">
            <table
              role="presentation"
              width="560"
              cellPadding={0}
              cellSpacing={0}
              style={{ maxWidth: 560, width: "100%" }}
            >
              <tbody>
                <Header issueNumber={payload.issueNumber} weekOf={payload.weekOf} />
                <HeroSummary summary={summary} />

                {amountChanges.length > 0 && (
                  <>
                    <SectionLabel>Amount changes</SectionLabel>
                    {amountChanges.map((c) => (
                      <AmountChangeRow key={c.id} change={c} />
                    ))}
                  </>
                )}

                {newOnes.length > 0 && (
                  <>
                    <SectionLabel>New programs</SectionLabel>
                    {newOnes.map((c) => (
                      <NewProgramRow key={c.id} change={c} />
                    ))}
                  </>
                )}

                {dead.length > 0 && (
                  <>
                    <SectionLabel>Dead programs</SectionLabel>
                    {dead.map((c) => (
                      <DeadRow key={c.id} change={c} />
                    ))}
                  </>
                )}

                <CTA siteUrl={payload.siteUrl} />
                <Footer siteUrl={payload.siteUrl} unsubscribeUrl={payload.unsubscribeUrl} />
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// Wraps the email body in a full HTML document for send-time.
// Usage: `const html = renderToStaticMarkup(<ChangelogEmailDocument payload={...} />)`
export function ChangelogEmailDocument({ payload }: { payload: ChangelogPayload }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`CreditsSpot · Changelog #${payload.issueNumber}`}</title>
      </head>
      <body style={{ margin: 0, padding: 0, background: BG }}>
        <ChangelogEmail payload={payload} />
      </body>
    </html>
  );
}

function Header({ issueNumber, weekOf }: { issueNumber: number; weekOf: string }) {
  return (
    <tr>
      <td style={{ padding: "8px 24px 20px" }}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td style={{ fontSize: 14, fontWeight: 600, color: FG, letterSpacing: "-0.01em" }}>
                Credits<span style={{ color: ACCENT_1 }}>Spot</span>
              </td>
              <td align="right" style={{ fontSize: 11, color: FG_DIM, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                #{String(issueNumber).padStart(3, "0")} · {weekOf}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}

function HeroSummary({ summary }: { summary: string }) {
  return (
    <tr>
      <td
        style={{
          padding: "32px 28px 28px",
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 14,
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: FG_DIM, marginBottom: 12 }}>
          This week
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: FG,
          }}
        >
          {summary}
        </h1>
      </td>
    </tr>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <tr>
      <td style={{ padding: "32px 4px 12px" }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: FG_DIM,
          }}
        >
          {children}
        </div>
      </td>
    </tr>
  );
}

function Pill({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 10,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        padding: "3px 8px",
        borderRadius: 999,
        color,
        background: `${color}15`,
        border: `1px solid ${color}30`,
      }}
    >
      {text}
    </span>
  );
}

function AmountChangeRow({ change }: { change: AmountChange }) {
  const accent = CATEGORY_ACCENT[change.category];
  const arrowColor = change.direction === "up" ? UP : DOWN;
  const arrow = change.direction === "up" ? "↑" : "↓";

  return (
    <tr>
      <td
        style={{
          padding: "20px 24px",
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          marginBottom: 8,
        }}
      >
        <div style={{ marginBottom: 10 }}>
          <Pill text={change.category} color={accent} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, color: FG, letterSpacing: "-0.01em", marginBottom: 12 }}>
          {change.name}
        </div>
        <table role="presentation" cellPadding={0} cellSpacing={0} style={{ marginBottom: 10 }}>
          <tbody>
            <tr>
              <td style={{ fontSize: 14, color: FG_MUTED, textDecoration: "line-through", paddingRight: 12 }}>
                {change.from}
              </td>
              <td style={{ fontSize: 16, color: arrowColor, fontWeight: 600, paddingRight: 12 }}>
                {arrow}
              </td>
              <td style={{ fontSize: 16, fontWeight: 600, color: FG }}>{change.to}</td>
            </tr>
          </tbody>
        </table>
        {change.note && (
          <div style={{ fontSize: 13, color: FG_MUTED, lineHeight: 1.6 }}>{change.note}</div>
        )}
      </td>
    </tr>
  );
}

function NewProgramRow({ change }: { change: NewProgram }) {
  const accent = CATEGORY_ACCENT[change.category];
  return (
    <tr>
      <td
        style={{
          padding: "20px 24px",
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          borderLeft: `2px solid ${accent}`,
        }}
      >
        <div style={{ marginBottom: 10 }}>
          <Pill text={`NEW · ${change.category}`} color={accent} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, color: FG, letterSpacing: "-0.01em", marginBottom: 6 }}>
          {change.name}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: accent, marginBottom: 10, letterSpacing: "-0.01em" }}>
          {change.amount}
        </div>
        <div style={{ fontSize: 13, color: FG_MUTED, lineHeight: 1.6, marginBottom: 12 }}>{change.note}</div>
        <a
          href={change.officialUrl}
          style={{
            fontSize: 12,
            color: FG,
            textDecoration: "none",
            borderBottom: `1px solid ${accent}`,
            paddingBottom: 1,
          }}
        >
          Official page →
        </a>
      </td>
    </tr>
  );
}

function DeadRow({ change }: { change: DeadProgram }) {
  return (
    <tr>
      <td
        style={{
          padding: "18px 24px",
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          opacity: 0.72,
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <Pill text={`ENDED · ${change.category}`} color={DOWN} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: FG, letterSpacing: "-0.01em", marginBottom: 4 }}>
          {change.name}
        </div>
        <div style={{ fontSize: 13, color: FG_MUTED, lineHeight: 1.6 }}>
          Was {change.lastAmount}.{change.note ? ` ${change.note}` : ""}
        </div>
      </td>
    </tr>
  );
}

function CTA({ siteUrl }: { siteUrl: string }) {
  return (
    <tr>
      <td style={{ padding: "36px 0 8px" }}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td align="center">
                <a
                  href={siteUrl}
                  style={{
                    display: "inline-block",
                    background: `linear-gradient(135deg, ${ACCENT_1}, ${ACCENT_2})`,
                    color: "#050505",
                    padding: "12px 24px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    textDecoration: "none",
                  }}
                >
                  Open the directory →
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}

function Footer({ siteUrl, unsubscribeUrl }: { siteUrl: string; unsubscribeUrl: string }) {
  return (
    <tr>
      <td style={{ padding: "32px 4px 8px", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: FG_MUTED, lineHeight: 1.7, marginBottom: 12 }}>
          Someone you know applying to AWS/Stripe/GCP?
          <br />
          Forward this. New subscribers help us reach the next founder.
        </div>
        <div style={{ fontSize: 11, color: FG_DIM, lineHeight: 1.7 }}>
          <a href={siteUrl} style={{ color: FG_DIM, textDecoration: "none", marginRight: 12 }}>
            creditsspot.com
          </a>
          <a href={unsubscribeUrl} style={{ color: FG_DIM, textDecoration: "none" }}>
            Unsubscribe
          </a>
        </div>
      </td>
    </tr>
  );
}

function buildSummary(amount: number, newCount: number, deadCount: number): string {
  const parts: string[] = [];
  if (amount) parts.push(`${amount} amount change${amount === 1 ? "" : "s"}`);
  if (newCount) parts.push(`${newCount} new program${newCount === 1 ? "" : "s"}`);
  if (deadCount) parts.push(`${deadCount} ended`);
  if (parts.length === 0) return "Quiet week. Nothing material moved.";
  if (parts.length === 1) return `${parts[0]}.`;
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}.`;
  return `${parts[0]}, ${parts[1]}, ${parts[2]}.`;
}
