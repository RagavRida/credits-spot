"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";

type Props = {
  progress: MotionValue<number>;
};

// Thin fixed rail on the right edge showing how far through the hero sequence the user is.
// Fades in once they've started scrolling, fades out once the hero is done.
export default function ScrollRail({ progress }: Props) {
  const opacity = useTransform(progress, [0, 0.04, 0.94, 1], [0, 1, 1, 0]);
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className="absolute top-1/2 -translate-y-1/2 right-5 md:right-7 h-[52vh] w-px pointer-events-none"
    >
      <div className="relative h-full w-full bg-white/10 rounded-full">
        <motion.div
          style={{ height }}
          className="absolute top-0 left-0 w-full rounded-full"
        >
          <div className="h-full w-full bg-gradient-to-b from-accent-1 to-accent-2 rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  );
}
