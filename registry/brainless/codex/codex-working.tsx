"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CodexWorking — Codex's "Working" line.
 *
 * A static `•` bullet, the word Working with Codex's grayscale shimmer (a
 * bright band drifting left→right), and `(Ns • esc to interrupt)`. Polite
 * live region for screen readers.
 */
const BULLET = "#a7a7a7";
const DIM = "#7a7a7a";
const SHIMMER_DARK = "#808080";
const SHIMMER_LIGHT = "#e7e7e7";

export function CodexWorking({
  running = true,
  label = "Working",
  className,
}: {
  running?: boolean;
  label?: string;
  className?: string;
}) {
  const prefersReduced = usePrefersReducedMotion();
  const [secs, setSecs] = React.useState(0);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  if (!running) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-baseline gap-2 font-mono text-[13px] font-bold",
        className,
      )}
    >
      <style>{`
        .cx-working-shimmer {
          background-image: linear-gradient(
            90deg,
            ${SHIMMER_DARK} 0%,
            ${SHIMMER_DARK} 40%,
            ${SHIMMER_LIGHT} 50%,
            ${SHIMMER_DARK} 60%,
            ${SHIMMER_DARK} 100%
          );
          /* 200% size + 100%→−100% travel = one clean period (no loop hitch) */
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: cx-working-shine 1.6s linear infinite;
        }
        @keyframes cx-working-shine {
          from { background-position: 100% 0; }
          to   { background-position: -100% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cx-working-shimmer {
            animation: none;
            background-image: none;
            color: ${SHIMMER_LIGHT};
            -webkit-text-fill-color: ${SHIMMER_LIGHT};
          }
        }
      `}</style>
      <span aria-hidden style={{ color: BULLET }}>
        •
      </span>
      <span
        className={prefersReduced ? undefined : "cx-working-shimmer"}
        style={prefersReduced ? { color: SHIMMER_LIGHT } : undefined}
      >
        {label}
      </span>
      <span className="font-normal" style={{ color: DIM }}>
        ({secs}s • esc to interrupt)
      </span>
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}
