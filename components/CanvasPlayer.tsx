"use client";

import { MotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 120;

function framePath(i: number) {
  return `/frames/${String(i + 1).padStart(4, "0")}.jpg`;
}

type Props = {
  progress: MotionValue<number>;
};

export default function CanvasPlayer({ progress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  // Start in fallback mode. Swap to real frames only if they successfully preload.
  const hasFramesRef = useRef(false);
  const [, forceRender] = useState(0);

  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      draw(frameRef.current);
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    let cancelled = false;

    // Probe the first frame with explicit onload/onerror + short timeout.
    // If it fails or times out, stay in fallback mode — no blocking loader.
    const probeOk = new Promise<boolean>((resolve) => {
      const img = new Image();
      const t = setTimeout(() => resolve(false), 2500);
      img.onload = () => {
        clearTimeout(t);
        resolve(img.naturalWidth > 0);
      };
      img.onerror = () => {
        clearTimeout(t);
        resolve(false);
      };
      img.src = framePath(0);
    });

    probeOk.then(async (ok) => {
      if (cancelled || !ok) return;

      const images: HTMLImageElement[] = [];
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = framePath(i);
        images.push(img);
      }
      await Promise.all(
        images.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete && img.naturalWidth > 0) return resolve();
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }),
        ),
      );
      if (cancelled) return;

      imagesRef.current = images;
      hasFramesRef.current = true;
      forceRender((n) => n + 1);
      draw(frameRef.current);
    });

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useMotionValueEvent(progress, "change", (latest) => {
    const idx = Math.max(
      0,
      Math.min(FRAME_COUNT - 1, Math.round(latest * (FRAME_COUNT - 1))),
    );
    if (idx === frameRef.current) return;
    frameRef.current = idx;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => draw(idx));
  });

  function draw(idx: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, w, h);

    const img = imagesRef.current[idx];
    if (!hasFramesRef.current || !img || !img.complete || img.naturalWidth === 0) {
      drawFallback(ctx, w, h, idx);
      return;
    }

    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw = w;
    let dh = h;
    if (ir > cr) {
      dh = h;
      dw = h * ir;
    } else {
      dw = w;
      dh = w / ir;
    }
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function drawFallback(ctx: CanvasRenderingContext2D, w: number, h: number, idx: number) {
    const t = idx / (FRAME_COUNT - 1);
    const cx = w / 2;
    const cy = h / 2;
    const explode = Math.sin(t * Math.PI);

    const colors = [
      "#3B82F6",
      "#A855F7",
      "#F59E0B",
      "#EC4899",
      "#10B981",
      "#FF9933",
      "#94A3B8",
      "#FFD54F",
    ];

    const spread = explode * Math.min(w, h) * 0.35;

    for (let i = 0; i < 8; i++) {
      const layerT = (i - 3.5) / 4;
      const y = cy + layerT * spread;
      const size = Math.min(w, h) * (0.28 - Math.abs(layerT) * 0.02);

      const g = ctx.createRadialGradient(cx, y, 0, cx, y, size);
      g.addColorStop(0, colors[i] + "66");
      g.addColorStop(0.6, colors[i] + "22");
      g.addColorStop(1, "#05050500");
      ctx.fillStyle = g;
      ctx.fillRect(0, y - size, w, size * 2);

      ctx.strokeStyle = colors[i] + (explode > 0.05 ? "88" : "33");
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, y, size * 0.9, size * 0.12, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.18);
    coreGrad.addColorStop(0, `rgba(255, 213, 79, ${0.5 + explode * 0.3})`);
    coreGrad.addColorStop(0.4, "rgba(0, 200, 83, 0.25)");
    coreGrad.addColorStop(1, "rgba(5, 5, 5, 0)");
    ctx.fillStyle = coreGrad;
    ctx.fillRect(0, 0, w, h);
  }

  return (
    <canvas
      ref={canvasRef}
      className="sticky top-0 h-screen w-full block"
      style={{ background: "#050505" }}
    />
  );
}
