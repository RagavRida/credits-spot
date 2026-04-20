"use client";

import { useScroll } from "framer-motion";
import { useRef } from "react";
import CanvasPlayer from "./CanvasPlayer";
import CopyOverlay from "./CopyOverlay";
import ScrollHint from "./ScrollHint";
import ScrollRail from "./ScrollRail";

export default function HeroSequence() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={sectionRef} className="relative h-[400vh] hero-radial">
      <div className="sticky top-0 h-screen overflow-hidden">
        <CanvasPlayer progress={scrollYProgress} />

        <CopyOverlay progress={scrollYProgress} range={[0, 0.18]} position="center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-fg-dim mb-4">
            The ultimate startup perks stack
          </p>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-fg leading-[1.05]">
            Over <span className="gradient-text">$1,000,000</span>
            <br />in credits. One place.
          </h1>
          <p className="mt-6 text-fg-muted text-base md:text-lg max-w-lg mx-auto">
            AWS, Google Cloud, Azure, Stripe, Razorpay, HubSpot, Notion — every program worth applying to,
            assembled and ready.
          </p>
        </CopyOverlay>

        <CopyOverlay progress={scrollYProgress} range={[0.15, 0.42]} position="left">
          <p className="text-[11px] tracking-[0.3em] uppercase text-accent-1 mb-3">01 · Cloud & Infra</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-fg">
            Run AI-heavy workloads for free.
          </h2>
          <p className="mt-5 text-fg-muted text-base md:text-lg">
            Up to <span className="text-fg">$350K</span> on GCP for AI startups,
            <span className="text-fg"> $150K</span> on Azure, <span className="text-fg">$100K</span> on AWS.
          </p>
        </CopyOverlay>

        <CopyOverlay progress={scrollYProgress} range={[0.40, 0.67]} position="right">
          <p className="text-[11px] tracking-[0.3em] uppercase text-accent-2 mb-3">02 · Dev & Data</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-fg">
            Don&apos;t stitch tools. Just ship.
          </h2>
          <p className="mt-5 text-fg-muted text-base md:text-lg">
            GitHub Enterprise for 20 seats. MongoDB Atlas credits. PostHog up to
            <span className="text-fg"> $50K</span> — analytics, flags, and replays in one.
          </p>
        </CopyOverlay>

        <CopyOverlay progress={scrollYProgress} range={[0.65, 0.87]} position="left">
          <p className="text-[11px] tracking-[0.3em] uppercase text-accent-1 mb-3">03 · Payments & India</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-fg">
            Stripe Atlas + Razorpay Rize.
          </h2>
          <p className="mt-5 text-fg-muted text-base md:text-lg">
            <span className="text-fg">$50K+</span> in Stripe partner perks.
            <span className="text-fg"> ₹30L+</span> in Razorpay perks plus
            <span className="text-fg"> $300K–$500K</span> in Rize partner credits.
          </p>
        </CopyOverlay>

        <CopyOverlay progress={scrollYProgress} range={[0.84, 1.0]} position="center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-fg-dim mb-4">Start stacking</p>
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-fg">
            Your next <span className="gradient-text">million</span>
            <br />is a scroll away.
          </h2>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <a
              href="#waitlist"
              className="gradient-cta px-7 py-3 rounded-full text-sm font-medium tracking-wide pointer-events-auto hover:scale-[1.02] transition-transform"
            >
              Join the waitlist
            </a>
            <a
              href="#directory"
              className="pointer-events-auto text-fg-muted hover:text-fg text-sm tracking-wide transition-colors px-4 py-3"
            >
              or browse now ↓
            </a>
          </div>
        </CopyOverlay>

        <ScrollHint progress={scrollYProgress} />
        <ScrollRail progress={scrollYProgress} />
      </div>
    </section>
  );
}
