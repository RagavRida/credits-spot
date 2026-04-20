import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let email: string;
  let referrer: string | undefined;
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
    referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 200) : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email || email.length > 200 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.WAITLIST_NOTIFY_EMAIL;
  const fromEmail = process.env.RESEND_FROM || "CreditsSpot <onboarding@resend.dev>";

  if (!resendKey) {
    console.log(`[waitlist] ${email} (referrer=${referrer ?? "-"}) — Resend not configured, logged only`);
    return NextResponse.json({ ok: true, delivered: false });
  }

  // Notify the owner first — this is the "database". If it fails, signup fails.
  // The welcome email to the signer is best-effort: Resend's default sender
  // `onboarding@resend.dev` only delivers to the account owner until a domain is
  // verified, so we don't fail the request if it bounces.
  if (notifyTo) {
    try {
      await send(resendKey, {
        from: fromEmail,
        to: notifyTo,
        subject: `[CreditsSpot] new signup · ${email}`,
        html: notifyHtml(email, referrer),
      });
    } catch (err) {
      console.error("[waitlist] notify failed:", err);
      return NextResponse.json(
        { error: "Couldn't record signup. Try again in a minute." },
        { status: 502 },
      );
    }
  }

  let welcomeDelivered = true;
  try {
    await send(resendKey, {
      from: fromEmail,
      to: email,
      subject: "You're on the CreditsSpot list.",
      html: welcomeHtml(),
    });
  } catch (err) {
    welcomeDelivered = false;
    console.warn("[waitlist] welcome email skipped (domain likely unverified):", err);
  }

  return NextResponse.json({ ok: true, delivered: true, welcomeDelivered });
}

async function send(key: string, msg: { from: string; to: string; subject: string; html: string }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(msg),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

function welcomeHtml() {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:40px 20px;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#0a0a0c;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px;">
      <tr><td>
        <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:16px;">CreditsSpot</div>
        <h1 style="font-size:28px;font-weight:600;color:rgba(255,255,255,0.95);margin:0 0 16px;line-height:1.2;">
          You're on the list.
        </h1>
        <p style="font-size:15px;line-height:1.6;color:rgba(255,255,255,0.7);margin:0 0 20px;">
          Every week we scan every major startup credit program — AWS, GCP, Azure, Stripe, Razorpay, Notion, 100+ more — and ship you a one-email digest of what changed: amounts up, amounts down, new programs launched, old ones killed.
        </p>
        <p style="font-size:15px;line-height:1.6;color:rgba(255,255,255,0.7);margin:0 0 24px;">
          First issue drops soon. Until then, you can already browse the live directory.
        </p>
        <a href="https://creditsspot.com" style="display:inline-block;background:linear-gradient(135deg,#00c853,#ffd54f);color:#050505;padding:12px 22px;border-radius:999px;font-size:13px;font-weight:600;text-decoration:none;letter-spacing:0.02em;">Browse the directory →</a>
        <p style="font-size:12px;color:rgba(255,255,255,0.35);margin:32px 0 0;border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;">
          If this landed in spam, drag it out. It helps us reach the next founder.
        </p>
      </td></tr>
    </table>
  </body>
</html>`;
}

function notifyHtml(email: string, referrer?: string) {
  return `<div style="font-family:-apple-system,sans-serif;font-size:14px;line-height:1.6;">
    <p><b>New CreditsSpot waitlist signup</b></p>
    <p>Email: <code>${escapeHtml(email)}</code><br/>
    Time: ${new Date().toISOString()}<br/>
    ${referrer ? `Referrer: <code>${escapeHtml(referrer)}</code>` : "Referrer: —"}</p>
  </div>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
