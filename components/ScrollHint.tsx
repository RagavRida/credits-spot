"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";

type Props = {
  progress: MotionValue<number>;
};

// Fades in while the hero is near scroll start, out as soon as the user engages.
export default function ScrollHint({ progress }: Props) {
  const opacity = useTransform(progress, [0, 0.02, 0.08], [1, 1, 0]);
  const y = useTransform(progress, [0, 0.08], [0, 12]);

  return (
    <motion.div
      aria-hidden
      style={{ opacity, y }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
    >
      <span className="text-[10px] tracking-[0.32em] uppercase text-fg-dim">
        Scroll to explore
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-1"
      >
        <svg
          width="12"
          height="14"
          viewBox="0 0 12 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 1V11M6 11L1 6.5M6 11L11 6.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-fg-muted"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
