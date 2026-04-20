"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 60);
  });

  const bg = useTransform(scrollY, [0, 60], ["rgba(5,5,5,0)", "rgba(5,5,5,0.8)"]);

  return (
    <motion.header
      style={{ backgroundColor: bg }}
      className={`fixed top-0 left-0 right-0 z-50 h-11 flex items-center px-6 md:px-10 transition-[backdrop-filter] duration-300 ${
        scrolled ? "backdrop-blur-md border-b border-border" : ""
      }`}
    >
      <a href="#" className="text-fg text-sm font-semibold tracking-tight">
        Credits<span className="gradient-text">Spot</span>
      </a>

      <nav className="hidden md:flex items-center gap-7 ml-10 text-xs text-fg-muted">
        <a href="#directory" className="hover:text-fg transition-colors">Directory</a>
        <a href="#strategy" className="hover:text-fg transition-colors">Strategy</a>
        <a href="#waitlist" className="hover:text-fg transition-colors">Changelog</a>
      </nav>

      <a
        href="#waitlist"
        className="ml-auto gradient-cta px-4 py-1.5 rounded-full text-[11px] font-medium tracking-wide hover:scale-[1.03] transition-transform"
      >
        Join waitlist
      </a>
    </motion.header>
  );
}
