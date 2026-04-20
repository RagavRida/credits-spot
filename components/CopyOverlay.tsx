"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { ReactNode } from "react";

type Position = "center" | "left" | "right";

type Props = {
  progress: MotionValue<number>;
  range: [number, number];
  position?: Position;
  children: ReactNode;
};

const positionClass: Record<Position, string> = {
  center: "items-center text-center",
  left: "items-start text-left md:pl-16",
  right: "items-end text-right md:pr-16",
};

export default function CopyOverlay({ progress, range, position = "center", children }: Props) {
  const [start, end] = range;
  const fadeIn = start + (end - start) * 0.15;
  const fadeOut = end - (end - start) * 0.15;

  const opacity = useTransform(progress, [start, fadeIn, fadeOut, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, fadeIn, fadeOut, end], [20, 0, 0, -20]);

  return (
    <motion.div
      style={{ opacity, y }}
      className={`pointer-events-none absolute inset-0 flex flex-col justify-center px-6 md:px-12 ${positionClass[position]}`}
    >
      <div className="max-w-xl">{children}</div>
    </motion.div>
  );
}
